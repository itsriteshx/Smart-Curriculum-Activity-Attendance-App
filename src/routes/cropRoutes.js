/**
 * @file cropRoutes.js
 * @description Express routing definitions for Crop Recommendations & Agronomic Directory.
 * Endpoints:
 *   GET /api/crops/recommend/:farmerId       - Top 5 personalized crop recommendations
 *   GET /api/crops/:cropId                   - Agronomic parameters for a specific crop
 *   GET /api/crops/region/:state/:district   - Crops suitable for state/district
 *   GET /api/crops/seasonal/:season          - Crops suitable for agricultural season
 */

const express = require('express');
const router = express.Router();
const {
  recommendCrops,
  getCropDetails,
  getCropsByRegion,
  getSeasonalCrops,
} = require('../controllers/cropController');

// Crop routes
router.get('/recommend/:farmerId', recommendCrops);
router.get('/region/:state/:district', getCropsByRegion);
router.get('/seasonal/:season', getSeasonalCrops);
router.get('/:cropId', getCropDetails);

module.exports = router;
