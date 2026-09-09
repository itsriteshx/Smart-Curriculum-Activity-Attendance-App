/**
 * @file validators.js
 * @description Input validation helper functions for agricultural parameters, coordinates, and NPK metrics.
 */

const validateNPK = (n, p, k) => {
  return (
    typeof n === 'number' && n >= 0 && n <= 1000 &&
    typeof p === 'number' && p >= 0 && p <= 500 &&
    typeof k === 'number' && k >= 0 && k <= 1000
  );
};

const validateCoordinates = (lat, lon) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  return (
    !isNaN(latitude) && latitude >= -90 && latitude <= 90 &&
    !isNaN(longitude) && longitude >= -180 && longitude <= 180
  );
};

const validateRating = (rating) => {
  const r = Number(rating);
  return !isNaN(r) && r >= 1 && r <= 5;
};

module.exports = {
  validateNPK,
  validateCoordinates,
  validateRating,
};
