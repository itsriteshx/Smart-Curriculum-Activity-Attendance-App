/**
 * @file feedbackRoutes.js
 * @description Express routing definitions for Advisory Ratings & Farmer Feedback.
 * Endpoints:
 *   POST /api/feedback       - Submit rating and qualitative feedback
 *   GET  /api/feedback/stats - View feedback analytics (Admin only)
 */

const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbackStats } = require('../controllers/feedbackController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

// Submit feedback (accessible to farmers)
router.post('/', submitFeedback);

// View feedback statistics (restricted to Admin)
router.get('/stats', verifyToken, authorizeRoles(ROLES.ADMIN), getFeedbackStats);

module.exports = router;
