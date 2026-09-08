/**
 * @file User.js
 * @description Mongoose model for system users (Farmers, Agricultural Officers, Admins).
 * Implements password hashing via bcryptjs pre-save middleware and comparison helper.
 * 
 * Viva tip:
 * Why use pre('save') hook for hashing?
 * Because it guarantees that whenever a user password is created or updated,
 * it is hashed automatically before persisting to MongoDB, preventing plaintext leaks.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, LANGUAGES } = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Prevents password from being returned in standard queries by default
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)',
      ],
    },
    userRole: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: 'Invalid user role ({VALUE}). Must be farmer, officer, or admin.',
      },
      default: ROLES.FARMER,
    },
    language_preference: {
      type: String,
      enum: {
        values: Object.values(LANGUAGES),
        message: 'Language must be Hindi or English',
      },
      default: LANGUAGES.HINDI,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

/**
 * Pre-save Mongoose Hook: Hash password before saving to the database
 * If password is not modified, skip rehashing (e.g. on profile update)
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt with cost factor 10 (balanced security and performance)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Instance Method: Compare candidate password with the stored hash
 * @param {string} candidatePassword - Plain text password entered during login
 * @returns {Promise<boolean>} True if matching, false otherwise
 */
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Remove sensitive password field when converting document to JSON
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
