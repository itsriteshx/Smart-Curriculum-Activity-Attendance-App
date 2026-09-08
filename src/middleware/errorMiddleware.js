/**
 * @file errorMiddleware.js
 * @description Centralized error handling middlewares.
 * Catches 404 Not Found and translates uncaught exceptions into clean, secure JSON responses.
 * 
 * Viva tip:
 * Why centralize error handling?
 * In Express, passing an error to `next(err)` triggers the 4-argument error middleware.
 * This guarantees consistent JSON response shapes, hides sensitive DB stack traces in production,
 * and handles Mongoose-specific errors (CastError, 11000 duplicate keys, ValidationError) uniformly.
 */

const { ERROR_MESSAGES } = require('../constants/messages');

/**
 * 404 Not Found handler for routes that do not exist
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global application error handler
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || ERROR_MESSAGES.SERVER_ERROR;
  let details = null;

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = `Resource not found with specified ID: ${err.value}`;
  }

  // 2. Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `Duplicate value '${value}' entered for ${field}. Please use another value.`;
  }

  // 3. Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = ERROR_MESSAGES.VALIDATION_FAILED;
    details = Object.values(err.errors).map((val) => val.message);
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authorization token. Signature verification failed.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authorization token has expired. Please log in again.';
  }

  // Log error stack trace on server side for developers
  if (process.env.NODE_ENV !== 'test') {
    console.error(`🚨 [Error ${statusCode}] ${req.method} ${req.originalUrl}:`, err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { errors: details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
