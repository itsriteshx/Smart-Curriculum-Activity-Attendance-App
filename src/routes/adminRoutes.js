/**
 * @file adminRoutes.js
 * @description Express routing definitions for Agricultural Admin Analytics Dashboard.
 * Strictly protected via JWT verification and RBAC ('admin' role only).
 * Endpoints:
 *   GET /api/admin/stats                 - Executive summary & macro metrics
 *   GET /api/admin/farmers/count         - Active farmer counts & regional breakdown
 *   GET /api/admin/crops/recommendations - Top recommended crop trends
 *   GET /api/admin/pests/common          - Prevalent pests and outbreak hot-spots
 */

const express = require('express');
const router = express.Router();
const {
  getStats,
  getFarmersCount,
  getTopRecommendedCrops,
  getMostCommonPests,
} = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

// Restrict entire admin route tree to authenticated admins
router.use(verifyToken);
router.use(authorizeRoles(ROLES.ADMIN));

router.get('/stats', getStats);
router.get('/farmers/count', getFarmersCount);
router.get('/crops/recommendations', getTopRecommendedCrops);
router.get('/pests/common', getMostCommonPests);

module.exports = router;
