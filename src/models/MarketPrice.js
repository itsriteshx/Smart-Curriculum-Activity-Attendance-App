/**
 * @file MarketPrice.js
 * @description Mongoose model for Agricultural Mandi Market Rates and Price History.
 * Stores daily APMC market prices across Indian districts with historical trends,
 * price shifts, and seasonal variations.
 */

const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    market: {
      type: String,
      required: [true, 'Mandi/Market name is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State name is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Modal price per quintal in INR is required'],
      min: [100, 'Price must be realistic (at least 100 INR/quintal)'],
    },
    minPrice: {
      type: Number,
      min: [100, 'Minimum price must be at least 100 INR'],
    },
    maxPrice: {
      type: Number,
      min: [100, 'Maximum price must be at least 100 INR'],
    },
    unit: {
      type: String,
      default: 'quintal',
    },
    priceChangePercentage: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Performance compound indexes for geospatial and commodity lookup
marketPriceSchema.index({ cropName: 1, state: 1, district: 1, date: -1 });
marketPriceSchema.index({ cropName: 1, date: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
