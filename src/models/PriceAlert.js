/**
 * @file PriceAlert.js
 * @description Mongoose model for Farmer Commodity Market Price Alerts.
 * Notifies farmers when APMC mandi rates reach desired price benchmarks.
 */

const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: [true, 'Farmer ID reference is required'],
      index: true,
    },
    cropName: {
      type: String,
      required: [true, 'Target crop name is required'],
      trim: true,
      lowercase: true,
    },
    alertType: {
      type: String,
      enum: {
        values: ['price_drop', 'price_rise', 'good_price'],
        message: '{VALUE} is not a valid alert type (price_drop, price_rise, good_price)',
      },
      required: [true, 'Alert type is required'],
    },
    targetPrice: {
      type: Number,
      required: [true, 'Target price threshold in INR per quintal is required'],
      min: [100, 'Target price must be at least 100 INR/quintal'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    triggeredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

priceAlertSchema.index({ farmerId: 1, isActive: 1 });
priceAlertSchema.index({ cropName: 1, isActive: 1 });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
