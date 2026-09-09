/**
 * @file Feedback.js
 * @description Mongoose model for Farmer Advisory Feedback & Ratings.
 * Enables farmers to rate the effectiveness and precision of agronomic advice.
 */

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: [true, 'Farmer ID reference is required'],
      index: true,
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      default: null,
    },
    rating: {
      type: Number,
      required: [true, 'Rating (1-5) is required'],
      min: [1, 'Rating cannot be less than 1'],
      max: [5, 'Rating cannot be greater than 5'],
    },
    comment: {
      type: String,
      required: [true, 'Feedback comments are required'],
      trim: true,
      maxlength: [1000, 'Feedback comment cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: ['crop', 'pest', 'fertilizer', 'weather', 'general'],
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ category: 1, rating: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
