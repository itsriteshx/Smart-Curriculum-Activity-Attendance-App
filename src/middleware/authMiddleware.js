/**
 * @file authMiddleware.js
 * @description JWT verification and Role-Based Access Control (RBAC) middleware.
 * Intercepts requests to protected endpoints, validates Bearer tokens,
 * and attaches authenticated user profile to `req.user`.
 * 
 * Viva tip:
 * How does JWT authentication work?
 * 1. Client sends token in 'Authorization: Bearer <token>' header.
 * 2. Server verifies token signature using a private secret (JWT_SECRET).
 * 3. Server decodes the payload (userId), finds user in DB, and attaches to req.
 * 4. Stateless authentication means no session memory needed on server!
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ERROR_MESSAGES } = require('../constants/messages');

/**
 * Protect routes: Verify JWT token in authorization header
 */
const verifyToken = async (req, res, next) => {
  let token;

  // Check for Bearer token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Token missing
  if (!token) {
    return res.status(401).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED,
    });
  }

  try {
    // Verify token using application secret
    const secret = process.env.JWT_SECRET || 'supersecret_agri_advisor_jwt_key_2026_dev_secure';
    const decoded = jwt.verify(token, secret);

    // Fetch user from database to ensure account still exists and is active
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    // Attach user document to Express request object
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN,
      error: error.message,
    });
  }
};

/**
 * Role-Based Access Control (RBAC) middleware
 * Restricts route access to specified roles
 * @param  {...string} roles Allowed roles (e.g. 'admin', 'officer')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.userRole)) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
        requiredRoles: roles,
        yourRole: req.user ? req.user.userRole : 'none',
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles,
};
