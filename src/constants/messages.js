/**
 * @file messages.js
 * @description Standardized error and success messages returned across the API.
 * Ensures consistent, clean, and internationalization-ready response texts.
 * 
 * Viva tip:
 * Consistent error structures prevent leaking sensitive internal stack traces to the client
 * and provide predictable messages for front-end toast notifications.
 */

const ERROR_MESSAGES = Object.freeze({
  SERVER_ERROR: 'Internal server error occurred. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_EXISTS: 'A user with this email address already exists.',
  PHONE_EXISTS: 'A user with this phone number already exists.',
  USER_NOT_FOUND: 'User account not found.',
  UNAUTHORIZED: 'Access denied. No authorization token provided.',
  INVALID_TOKEN: 'Invalid or expired authentication token.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  PROFILE_EXISTS: 'Farmer profile already exists for this user account.',
  PROFILE_NOT_FOUND: 'Farmer profile not found.',
  VALIDATION_FAILED: 'Validation failed. Please verify the submitted data.',
  WEATHER_FETCH_FAILED: 'Unable to retrieve weather data at this time.',
});

const SUCCESS_MESSAGES = Object.freeze({
  REGISTER_SUCCESS: 'User registered successfully.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PROFILE_CREATED: 'Farmer profile created successfully.',
  PROFILE_UPDATED: 'Farmer profile updated successfully.',
  PROFILE_FETCHED: 'Farmer profile retrieved successfully.',
  WEATHER_FETCHED: 'Weather forecast and agricultural recommendations retrieved successfully.',
});

module.exports = {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
