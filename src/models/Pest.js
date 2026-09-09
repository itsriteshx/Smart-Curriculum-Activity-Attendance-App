/**
 * @file Pest.js
 * @description Mongoose model for Agricultural Pests and Plant Pathogens.
 * Catalogs insect pests, bacterial and fungal diseases with diagnostic symptoms,
 * organic biological controls, chemical remedies, and economic treatment thresholds.
 */

const mongoose = require('mongoose');

const pestSchema = new mongoose.Schema(
  {
    pestName: {
      type: String,
      required: [true, 'Pest or disease name is required'],
      unique: true,
      trim: true,
    },
    scientificName: {
      type: String,
      trim: true,
    },
    affectedCrops: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    symptoms: {
      type: String,
      required: [true, 'Diagnostic symptoms description is required'],
      trim: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ['mild', 'moderate', 'severe'],
      default: 'moderate',
    },
    treatment: {
      organic: {
        type: String,
        required: [true, 'Organic/biological treatment protocol is required'],
        trim: true,
      },
      chemical: {
        type: String,
        required: [true, 'Chemical/pesticide treatment recommendation is required'],
        trim: true,
      },
    },
    treatmentCostPerAcre: {
      type: Number,
      required: [true, 'Estimated treatment cost per acre in INR is required'],
      min: [0, 'Treatment cost cannot be negative'],
    },
    preventiveMeasures: {
      type: String,
      required: [true, 'Preventive agronomic measures are required'],
      trim: true,
    },
    seasonalOccurrence: {
      type: String,
      enum: ['Kharif', 'Rabi', 'Zaid', 'Monsoon', 'Summer', 'All-Season'],
      default: 'All-Season',
    },
    imagePlaceholder: {
      type: String,
      default: '/uploads/pests/default-pest.png',
    },
  },
  {
    timestamps: true,
  }
);

pestSchema.index({ affectedCrops: 1 });
pestSchema.index({ seasonalOccurrence: 1 });

module.exports = mongoose.model('Pest', pestSchema);
