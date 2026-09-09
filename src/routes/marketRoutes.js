/**
 * @file marketRoutes.js
 * @description Express routing definitions for APMC Mandi Market Prices, Historical Charts & Alerts.
 * Endpoints:
 *   GET  /api/market/prices/:cropName/:state/:district - Current mandi price
 *   GET  /api/market/history/:cropName                 - 7-day, 30-day, and 1-year historical trends
 *   GET  /api/market/sell-recommendation/:cropName/:farmerId - Buy/sell decision intelligence
 *   POST /api/market/alert/create                      - Subscribe to price alert
 *   GET  /api/market/alert/:farmerId                   - Active alerts for farmer
 *   PUT  /api/market/alert/:alertId                    - Update or disable alert
 */

const express = require('express');
const router = express.Router();
const {
  getCurrentPrice,
  getPriceHistory,
  calculateBestSellTime,
  createAlert,
  getFarmerAlerts,
  updateAlert,
} = require('../controllers/marketController');

router.get('/prices/:cropName/:state/:district', getCurrentPrice);
router.get('/history/:cropName', getPriceHistory);
router.get('/sell-recommendation/:cropName/:farmerId', calculateBestSellTime);

// Price Alerts
router.post('/alert/create', createAlert);
router.get('/alert/:farmerId', getFarmerAlerts);
router.put('/alert/:alertId', updateAlert);

module.exports = router;
