/**
 * @file Crop.js
 * @description Mongoose model for Crops in the Smart Agricultural Advisory System.
 * Stores agronomic parameters: climatic requirements, soil affinity, water needs,
 * input costs, yield expectations, and market demand for crop recommendation calculations.
 */

const mongoose = require('mongoose');
const { SOIL_TYPES } = require('../constants/roles');

const cropSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required (e.g. Wheat, Rice, Cotton)'],
      trim: true,
    },
    season: {
      type: String,
      required: [true, 'Crop season is required'],
      enum: {
        values: ['Kharif', 'Rabi', 'Zaid', 'Perennial', 'All-Season'],
        message: '{VALUE} is not a supported crop season (Kharif, Rabi, Zaid, Perennial, All-Season)',
      },
    },
    idealSoilType: [
      {
        type: String,
        enum: {
          values: SOIL_TYPES,
          message: '{VALUE} is not a recognized soil type',
        },
      },
    ],
    waterRequirement: {
      type: Number,
      required: [true, 'Water requirement in mm per season is required'],
      min: [50, 'Water requirement must be at least 50mm'],
    },
    temperature: {
      min: {
        type: Number,
        required: [true, 'Minimum temperature requirement in Celsius is required'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum temperature requirement in Celsius is required'],
      },
    },
    harvestingPeriod: {
      type: Number,
      required: [true, 'Harvesting period in days is required'],
      min: [30, 'Harvesting period must be at least 30 days'],
    },
    expectedYield: {
      type: Number,
      required: [true, 'Expected yield per acre (quintals) is required'],
      min: [0.5, 'Expected yield must be at least 0.5 quintals/acre'],
    },
    seedCost: {
      type: Number,
      required: [true, 'Seed cost per acre (INR) is required'],
      min: [0, 'Seed cost cannot be negative'],
    },
    fertilizerCost: {
      type: Number,
      required: [true, 'Fertilizer cost per acre (INR) is required'],
      min: [0, 'Fertilizer cost cannot be negative'],
    },
    laborCost: {
      type: Number,
      required: [true, 'Labor cost per acre (INR) is required'],
      min: [0, 'Labor cost cannot be negative'],
    },
    marketDemand: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    suitableStates: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Performance compound indexes
cropSchema.index({ season: 1, idealSoilType: 1 });
cropSchema.index({ suitableStates: 1 });

module.exports = mongoose.model('Crop', cropSchema);
