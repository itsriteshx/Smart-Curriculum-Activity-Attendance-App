/**
 * @file roles.js
 * @description Defines application-wide user roles, soil types, and language preferences.
 * Useful for role-based access control (RBAC) and schema enumerations.
 * 
 * Viva tip:
 * Centralizing role strings prevents typos (e.g., 'farmer' vs 'Farmer')
 * and makes adding new roles (like 'RESEARCHER') easy across the entire project.
 */

const ROLES = Object.freeze({
  FARMER: 'farmer',
  OFFICER: 'officer',
  ADMIN: 'admin',
});

const LANGUAGES = Object.freeze({
  HINDI: 'Hindi',
  ENGLISH: 'English',
});

const SOIL_TYPES = Object.freeze([
  'clay',
  'sandy',
  'loamy',
  'silt',
  'peat',
  'black_cotton', // Common in Maharashtra, MP, Gujarat (Regur soil)
  'alluvial',     // Common in Indo-Gangetic plains (Punjab, UP, Bihar)
  'red',          // Common in Southern & Eastern India
]);

const WATER_AVAILABILITY = Object.freeze([
  'irrigated',
  'rainfed',
  'partially_irrigated',
]);

module.exports = {
  ROLES,
  LANGUAGES,
  SOIL_TYPES,
  WATER_AVAILABILITY,
};
