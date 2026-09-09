/**
 * @file Fertilizer.js
 * @description Mongoose model for Agricultural Fertilizers and Nutrients.
 * Catalogs commercial fertilizers (Urea, DAP, MOP, SSP, NPK complexes) with
 * chemical ratios, application guidelines, and packaging costs.
 */

const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Fertilizer name is required (e.g., Urea, DAP, MOP)'],
      unique: true,
      trim: true,
    },
    npkRatio: {
      n: { type: Number, required: true, min: 0, max: 100, default: 0 },
      p: { type: Number, required: true, min: 0, max: 100, default: 0 },
      k: { type: Number, required: true, min: 0, max: 100, default: 0 },
    },
    costPerBag: {
      type: Number,
      required: [true, 'Cost per bag in INR is required'],
      min: [0, 'Cost cannot be negative'],
    },
    bagWeightKg: {
      type: Number,
      default: 50,
      min: [1, 'Bag weight must be at least 1 kg'],
    },
    dosagePerAcre: {
      type: Number,
      required: [true, 'Standard dosage per acre in kg is required'],
      min: [1, 'Dosage must be at least 1 kg/acre'],
    },
    applicationMethod: {
      type: String,
      required: [true, 'Application method is required'],
      enum: ['Basal Dressing', 'Top Dressing', 'Foliar Spray', 'Broadcasting', 'Fertigation'],
      default: 'Basal Dressing',
    },
    bestTiming: {
      type: String,
      required: [true, 'Best application timing guideline is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fertilizer', fertilizerSchema);
