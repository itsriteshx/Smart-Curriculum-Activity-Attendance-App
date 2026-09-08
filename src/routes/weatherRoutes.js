/**
 * @file weatherRoutes.js
 * @description Express routing definition for Weather & Agro-meteorological Advisory endpoints.
 * Endpoints:
 *   GET /api/weather/:lat/:long - Get weather, agricultural recommendations, and cache status
 */

const express = require('express');
const router = express.Router();

const { getWeatherByCoordinates } = require('../controllers/weatherController');
const { validateCoordinates } = require('../middleware/validateMiddleware');

// Coordinate-based weather and advisory route
router.get('/:lat/:long', validateCoordinates, getWeatherByCoordinates);

module.exports = router;
