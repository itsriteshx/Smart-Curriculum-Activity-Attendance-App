/**
 * @file farmerRoutes.js
 * @description Express routing definition for Farmer Profile management.
 * All endpoints are secured by verifyToken JWT middleware.
 * Endpoints:
 *   POST /api/farmer/profile              - Create new farmer profile
 *   GET  /api/farmer/me                   - Get current logged-in farmer profile
 *   GET  /api/farmer/profile/:farmerId    - Get profile by Farmer ID or User ID
 *   PUT  /api/farmer/profile/:farmerId    - Update farmer profile
 *   GET  /api/farmer/profile/:farmerId/completion - Get profile completion analytics
 */

const express = require('express');
const router = express.Router();

const {
  createProfile,
  getProfile,
  getMyProfile,
  updateProfile,
  getProfileCompletion,
} = require('../controllers/farmerController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protect all farmer routes with JWT verification
router.use(verifyToken);

// Farmer profile endpoints
router.post('/profile', createProfile);
router.get('/me', getMyProfile);
router.get('/profile/:farmerId', getProfile);
router.put('/profile/:farmerId', updateProfile);
router.get('/profile/:farmerId/completion', getProfileCompletion);

module.exports = router;
