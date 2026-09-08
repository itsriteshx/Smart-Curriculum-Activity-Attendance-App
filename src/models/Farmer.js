/**
 * @file Farmer.js
 * @description Mongoose model for Farmer Profiles.
 * Stores geo-location, farm size in acres, soil categorization, irrigation source,
 * and current/seasonal crops grown. Linked 1-to-1 with User model via userId.
 * 
 * Viva tip:
 * Why separate User and Farmer models?
 * Separation of Concerns (SoC). User handles auth & login credentials (applicable to Admin/Officer too),
 * while Farmer contains domain-specific agricultural attributes.
 */

const mongoose = require('mongoose');
const { SOIL_TYPES, WATER_AVAILABILITY } = require('../constants/roles');

// Sub-schema for individual crop entries
const cropSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required (e.g., Wheat, Rice, Mustard)'],
      trim: true,
    },
    season: {
      type: String,
      enum: {
        values: ['Kharif', 'Rabi', 'Zaid', 'Perennial'],
        message: 'Season must be Kharif (Monsoon), Rabi (Winter), Zaid (Summer), or Perennial',
      },
      default: 'Kharif',
    },
    sowingDate: {
      type: Date,
    },
    expectedHarvestDate: {
      type: Date,
    },
    areaInAcres: {
      type: Number,
      min: [0.1, 'Crop area must be at least 0.1 acre'],
    },
  },
  { _id: true }
);

const farmerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A valid User ID reference is required'],
      unique: true, // One farmer profile per user
    },
    location: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
      },
      state: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
    },
    farmSize: {
      type: Number,
      required: [true, 'Farm size in acres is required'],
      min: [0.1, 'Farm size must be at least 0.1 acres'],
    },
    soilType: {
      type: String,
      required: [true, 'Soil type is required'],
      enum: {
        values: SOIL_TYPES,
        message: 'Soil type must be one of: ' + SOIL_TYPES.join(', '),
      },
    },
    waterAvailability: {
      type: String,
      required: [true, 'Water availability source is required'],
      enum: {
        values: WATER_AVAILABILITY,
        message: 'Water availability must be: ' + WATER_AVAILABILITY.join(', '),
      },
      default: 'irrigated',
    },
    cropsGrown: [cropSchema],
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Helper: Check if profile has all primary fields filled
 */
farmerSchema.methods.calculateCompletion = function () {
  const fields = [
    Boolean(this.farmSize),
    Boolean(this.soilType),
    Boolean(this.waterAvailability),
    Boolean(this.location && this.location.state && this.location.district),
    Boolean(this.location && typeof this.location.latitude === 'number' && typeof this.location.longitude === 'number'),
    Boolean(this.cropsGrown && this.cropsGrown.length > 0),
  ];

  const completedFields = fields.filter(Boolean).length;
  const percentage = Math.round((completedFields / fields.length) * 100);
  return {
    percentage,
    isComplete: percentage >= 80,
  };
};

const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;
