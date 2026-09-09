/**
 * @file soilRoutes.js
 * @description Express routing definitions for Soil Health Diagnostics and Fertilizer Dosage Calculations.
 * Endpoints:
 *   POST /api/soil/analyze                                     - Upload & analyze lab soil test
 *   GET  /api/soil/analysis/:farmerId                          - Historical soil test logs
 *   GET  /api/soil/fertilizer-recommendation/:farmerId/:cropId - Precise fertilizer dosage plan
 *   POST /api/soil/set-reminder/:farmerId                      - Annual re-test reminder
 */

const express = require('express');
const router = express.Router();
const {
  analyzeSoil,
  getSoilAnalysisHistory,
  getFertilizerRecommendation,
  setReminder,
} = require('../controllers/soilController');

router.post('/analyze', analyzeSoil);
router.get('/analysis/:farmerId', getSoilAnalysisHistory);
router.get('/fertilizer-recommendation/:farmerId/:cropId', getFertilizerRecommendation);
router.post('/set-reminder/:farmerId', setReminder);

module.exports = router;
