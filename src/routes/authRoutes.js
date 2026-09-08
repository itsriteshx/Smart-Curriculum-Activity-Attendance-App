/**
 * @file authRoutes.js
 * @description Express routing definition for Authentication endpoints.
 * Endpoints:
 *   POST /api/auth/register - Register new user
 *   POST /api/auth/login    - Authenticate and return JWT
 *   POST /api/auth/logout   - Acknowledge logout
 *   GET  /api/auth/me       - Get authenticated profile (Protected)
 */

const express = require('express');
const router = express.Router();

const { register, login, logout, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected endpoints
router.get('/me', verifyToken, getMe);

module.exports = router;
