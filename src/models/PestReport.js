/**
 * @file PestReport.js
 * @description Mongoose model for Farmer Pest Diagnostic Submissions and Incident Logs.
 * Stores uploaded crop imagery, automated AI/pattern diagnostic matches, confidence ratings,
 * and treatment recommendations.
 */

const mongoose = require('mongoose');

const pestReportSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: [true, 'Farmer ID reference is required'],
      index: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name under observation is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Uploaded pest image path or URL is required'],
    },
    detectedPest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pest',
    },
    pestName: {
      type: String,
      trim: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'moderate',
    },
    recommendedTreatment: {
      organic: String,
      chemical: String,
      estimatedCost: Number,
    },
    symptomsObserved: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Analyzed', 'Action Taken', 'Resolved'],
      default: 'Analyzed',
    },
  },
  {
    timestamps: true,
  }
);

pestReportSchema.index({ farmerId: 1, createdAt: -1 });

module.exports = mongoose.model('PestReport', pestReportSchema);
