/**
 * @file authController.js
 * @description Controller handling User Authentication (Register, Login, Logout).
 * Generates JSON Web Tokens (JWT) signed with expiration and returns clean user profiles.
 * 
 * Viva tip:
 * What payload is encoded inside the JWT?
 * We only encode non-sensitive identifier `{ id: user._id }`.
 * Sensitive credentials like passwords or credit cards are NEVER stored in a JWT!
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants/messages');
const { ROLES, LANGUAGES } = require('../constants/roles');

/**
 * Helper: Sign a JSON Web Token for an authenticated user
 * @param {string} id - MongoDB ObjectId of User
 * @returns {string} Signed JWT string
 */
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'supersecret_agri_advisor_jwt_key_2026_dev_secure';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  return jwt.sign({ id }, secret, { expiresIn });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account (Farmer, Agricultural Officer, or Admin)
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password, phoneNumber, userRole, language_preference } = req.body;

    // Check if email already registered
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.USER_EXISTS,
      });
    }

    // Check if phone number already registered
    const existingPhone = await User.findOne({ phoneNumber: String(phoneNumber).trim() });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.PHONE_EXISTS,
      });
    }

    // Create user in database (password is automatically hashed by pre-save hook)
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phoneNumber: String(phoneNumber).trim(),
      userRole: userRole && Object.values(ROLES).includes(userRole) ? userRole : ROLES.FARMER,
      language_preference:
        language_preference && Object.values(LANGUAGES).includes(language_preference)
          ? language_preference
          : LANGUAGES.HINDI,
    });

    // Generate authentication token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userRole: user.userRole,
        language_preference: user.language_preference,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate registered user & get JWT token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve user and explicitly include password field (since select: false in schema)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Compare provided password with hashed password in database
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userRole: user.userRole,
        language_preference: user.language_preference,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (stateless acknowledgement for frontend token clearance)
 * @access  Public
 */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    instruction: 'Please remove JWT token from local client storage / headers.',
  });
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private (Requires Bearer token)
 */
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  generateToken,
};
