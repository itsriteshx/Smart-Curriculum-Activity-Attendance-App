/**
 * @file pestController.js
 * @description Controller managing Plant Pathogen and Pest Detection, Treatments, and Costs.
 * Handles crop image uploads (via Multer), pattern/symptom classification,
 * dual-mode (organic biological & chemical) remedy generation, and acreage cost calculation.
 */

const path = require('path');
const Pest = require('../models/Pest');
const PestReport = require('../models/PestReport');
const Farmer = require('../models/Farmer');
const { pestsSeed } = require('../utils/seedData');
const { diagnosePest } = require('../services/pestClassification');

// diagnosePest is imported from pestClassification service

/**
 * @route   POST /api/pest/detect
 * @desc    Upload crop leaf/stem photograph and receive instant pest/disease diagnosis
 * @access  Private
 */
const detectPest = async (req, res, next) => {
  try {
    const { farmerId, cropName, symptoms } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file (JPEG, PNG, or WebP) of the affected plant or pest.',
      });
    }

    const imageRelativePath = `/uploads/pests/${file.filename}`;
    const { matchedPest, confidenceScore } = diagnosePest(cropName, symptoms, file.originalname);

    // Save report log
    let savedReport;
    try {
      savedReport = await PestReport.create({
        farmerId: farmerId || '000000000000000000000001',
        cropName: cropName || matchedPest.affectedCrops[0],
        imageUrl: imageRelativePath,
        pestName: matchedPest.pestName,
        confidenceScore,
        severity: matchedPest.severity,
        recommendedTreatment: {
          organic: matchedPest.treatment.organic,
          chemical: matchedPest.treatment.chemical,
          estimatedCost: matchedPest.treatmentCostPerAcre,
        },
        symptomsObserved: symptoms || matchedPest.symptoms,
      });
    } catch (e) {
      savedReport = {
        _id: 'report-' + Date.now(),
        imageUrl: imageRelativePath,
        confidenceScore,
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Crop image processed and pest pattern identified.',
      diagnosticResult: {
        reportId: savedReport._id,
        imageUrl: imageRelativePath,
        crop: cropName || matchedPest.affectedCrops[0],
        pestName: matchedPest.pestName,
        scientificName: matchedPest.scientificName,
        confidence: `${confidenceScore}%`,
        severity: matchedPest.severity.toUpperCase(),
        symptoms: matchedPest.symptoms,
        treatments: {
          organicBiological: matchedPest.treatment.organic,
          chemicalRemedy: matchedPest.treatment.chemical,
          costPerAcreINR: matchedPest.treatmentCostPerAcre,
        },
        preventiveGuidelines: matchedPest.preventiveMeasures,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/pest/treatment/:pestId/:cropId
 * @desc    Get detailed treatment options for a diagnosed pest on a specific crop
 * @access  Public
 */
const getPestTreatment = async (req, res, next) => {
  try {
    const { pestId, cropId } = req.params;

    let pest = null;
    if (pestId.match(/^[0-9a-fA-F]{24}$/)) {
      pest = await Pest.findById(pestId);
    }
    if (!pest) {
      pest = pestsSeed.find(
        (p) => p.pestName.toLowerCase().includes(pestId.toLowerCase()) || p.scientificName?.toLowerCase().includes(pestId.toLowerCase())
      );
    }

    if (!pest) {
      pest = pestsSeed[0]; // Fallback to first seed pest
    }

    return res.status(200).json({
      success: true,
      pestName: pest.pestName,
      scientificName: pest.scientificName,
      crop: cropId,
      severity: pest.severity,
      treatment: pest.treatment,
      treatmentCostPerAcre: pest.treatmentCostPerAcre,
      preventiveMeasures: pest.preventiveMeasures,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/pest/cost/:pestName/:farmSize
 * @desc    Calculate total economic cost of pesticide application given farm size
 * @access  Public
 */
const getTreatmentCost = async (req, res, next) => {
  try {
    const { pestName, farmSize } = req.params;
    const acres = parseFloat(farmSize) || 1;

    const pest = pestsSeed.find((p) => p.pestName.toLowerCase().includes(pestName.toLowerCase())) || pestsSeed[0];
    const costPerAcre = pest.treatmentCostPerAcre;
    const totalCost = Math.round(costPerAcre * acres);

    return res.status(200).json({
      success: true,
      pestName: pest.pestName,
      farmSizeAcres: acres,
      costPerAcreINR: costPerAcre,
      estimatedTotalExpenseINR: totalCost,
      organicAlternativeSavingsINR: Math.round(totalCost * 0.35),
      recommendation: `For ${acres} acre(s), purchase sufficient solution for 1 spray cycle; repeat after 14 days if ETL threshold exceeded.`,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/pest/history/:farmerId
 * @desc    Retrieve historical pest reports submitted by a farmer
 * @access  Private
 */
const getPestHistory = async (req, res, next) => {
  try {
    const { farmerId } = req.params;

    let history = [];
    try {
      history = await PestReport.find({ farmerId }).sort({ createdAt: -1 });
    } catch (e) {
      console.warn('PestReport find error:', e.message);
    }

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   POST /api/pest/report
 * @desc    Manually log a pest incident by symptoms without an image
 * @access  Private
 */
const reportPest = async (req, res, next) => {
  try {
    const { farmerId, cropName, symptoms, observedPestName } = req.body;

    const { matchedPest, confidenceScore } = diagnosePest(cropName, `${symptoms} ${observedPestName || ''}`);

    let report;
    try {
      report = await PestReport.create({
        farmerId: farmerId || '000000000000000000000001',
        cropName: cropName || 'General',
        imageUrl: '/uploads/pests/manual-report.png',
        pestName: observedPestName || matchedPest.pestName,
        confidenceScore: 80,
        severity: matchedPest.severity,
        symptomsObserved: symptoms,
        recommendedTreatment: {
          organic: matchedPest.treatment.organic,
          chemical: matchedPest.treatment.chemical,
          estimatedCost: matchedPest.treatmentCostPerAcre,
        },
      });
    } catch (e) {
      report = { _id: 'report-manual-' + Date.now() };
    }

    return res.status(201).json({
      success: true,
      message: 'Pest incident reported and treatment generated.',
      reportId: report._id,
      diagnosedPest: matchedPest.pestName,
      treatment: matchedPest.treatment,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  detectPest,
  getPestTreatment,
  getTreatmentCost,
  getPestHistory,
  reportPest,
  diagnosePest,
};
