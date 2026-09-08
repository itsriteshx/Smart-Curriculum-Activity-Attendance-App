/**
 * @file validateMiddleware.js
 * @description Validates incoming request payloads before they reach controllers.
 * Catches malformed inputs early (Fail Fast principle).
 * 
 * Viva tip:
 * Validating at middleware prevents unwanted database queries on invalid inputs,
 * defending against NoSQL injections and malformed payloads.
 */

const { ERROR_MESSAGES } = require('../constants/messages');

/**
 * Validates user registration payload
 */
const validateRegister = (req, res, next) => {
  const { fullName, email, password, phoneNumber } = req.body;
  const errors = [];

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters long.');
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long.');
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneNumber || !phoneRegex.test(String(phoneNumber).trim())) {
    errors.push('A valid 10-digit Indian mobile number is required (starting with 6, 7, 8, or 9).');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.VALIDATION_FAILED,
      errors,
    });
  }

  next();
};

/**
 * Validates user login payload
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push('Please enter a valid email address.');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.VALIDATION_FAILED,
      errors,
    });
  }

  next();
};

/**
 * Validates coordinates for weather endpoint
 */
const validateCoordinates = (req, res, next) => {
  const lat = parseFloat(req.params.lat);
  const long = parseFloat(req.params.long);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({
      success: false,
      message: 'Invalid latitude. Must be a floating point number between -90 and 90.',
    });
  }

  if (isNaN(long) || long < -180 || long > 180) {
    return res.status(400).json({
      success: false,
      message: 'Invalid longitude. Must be a floating point number between -180 and 180.',
    });
  }

  req.parsedCoords = { lat, long };
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCoordinates,
};
