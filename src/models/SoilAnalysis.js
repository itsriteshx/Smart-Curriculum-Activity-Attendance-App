/**
 * @file SoilAnalysis.js
 * @description Mongoose model for Soil Health Analysis in the Smart Agricultural Advisory System.
 * Records laboratory soil test measurements: Nitrogen (N), Phosphorus (P), Potassium (K),
 * pH balance, and Organic Matter percentage with automated 365-day re-test reminder calculation.
 */

const mongoose = require('mongoose');

const soilAnalysisSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: [true, 'Farmer ID reference is required'],
      index: true,
    },
    nitrogen: {
      type: Number,
      required: [true, 'Nitrogen (N) value in kg/ha is required'],
      min: [0, 'Nitrogen value cannot be negative'],
      max: [1000, 'Nitrogen value exceeds realistic soil test bounds'],
    },
    phosphorus: {
      type: Number,
      required: [true, 'Phosphorus (P) value in kg/ha is required'],
      min: [0, 'Phosphorus value cannot be negative'],
      max: [500, 'Phosphorus value exceeds realistic soil test bounds'],
    },
    potassium: {
      type: Number,
      required: [true, 'Potassium (K) value in kg/ha is required'],
      min: [0, 'Potassium value cannot be negative'],
      max: [1000, 'Potassium value exceeds realistic soil test bounds'],
    },
    pH: {
      type: Number,
      required: [true, 'Soil pH level is required'],
      min: [0, 'pH must be between 0 and 14'],
      max: [14, 'pH must be between 0 and 14'],
    },
    organicMatter: {
      type: Number,
      required: [true, 'Organic matter percentage is required'],
      min: [0, 'Organic matter must be between 0 and 100%'],
      max: [100, 'Organic matter must be between 0 and 100%'],
      default: 0.75,
    },
    testDate: {
      type: Date,
      default: Date.now,
    },
    nextTestDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Optimal', 'Deficient', 'Critical', 'Needs Attention'],
      default: 'Optimal',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate nextTestDate (365 days after testDate)
soilAnalysisSchema.pre('save', function (next) {
  if (!this.testDate) {
    this.testDate = new Date();
  }
  if (!this.nextTestDate) {
    const nextDate = new Date(this.testDate);
    nextDate.setDate(nextDate.getDate() + 365);
    this.nextTestDate = nextDate;
  }

  // Automatic status calculation
  const isDeficient = this.nitrogen < 280 || this.phosphorus < 10 || this.potassium < 110;
  const isCritical = this.pH < 5.5 || this.pH > 8.5 || this.nitrogen < 150;
  if (isCritical) {
    this.status = 'Critical';
  } else if (isDeficient) {
    this.status = 'Deficient';
  } else {
    this.status = 'Optimal';
  }

  next();
});

soilAnalysisSchema.index({ farmerId: 1, testDate: -1 });

module.exports = mongoose.model('SoilAnalysis', soilAnalysisSchema);
