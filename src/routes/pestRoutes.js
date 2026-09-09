/**
 * @file pestRoutes.js
 * @description Express routing definitions for Pest & Disease Diagnostics and Remedies.
 * Endpoints:
 *   POST /api/pest/detect                     - Upload plant image for pest/pathogen identification
 *   GET  /api/pest/treatment/:pestId/:cropId  - Specific treatment for pest/crop
 *   GET  /api/pest/cost/:pestName/:farmSize   - Calculate economic cost for acreage
 *   GET  /api/pest/history/:farmerId          - Farmer's past diagnoses history
 *   POST /api/pest/report                     - Manual symptom-based pest logging
 */

const express = require('express');
const router = express.Router();
const { uploadPestImage } = require('../middleware/uploadMiddleware');
const {
  detectPest,
  getPestTreatment,
  getTreatmentCost,
  getPestHistory,
  reportPest,
} = require('../controllers/pestController');

// Image upload and detection route (Multer middleware: single file field 'image')
router.post('/detect', uploadPestImage.single('image'), detectPest);

// Agronomic remedy & cost calculator routes
router.get('/treatment/:pestId/:cropId', getPestTreatment);
router.get('/cost/:pestName/:farmSize', getTreatmentCost);
router.get('/history/:farmerId', getPestHistory);
router.post('/report', reportPest);

module.exports = router;
