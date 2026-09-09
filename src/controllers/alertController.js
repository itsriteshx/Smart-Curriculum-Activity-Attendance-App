/**
 * @file alertController.js
 * @description Controller handling Farmer Price Alerts.
 */

const { createAlert, getFarmerAlerts, updateAlert } = require('./marketController');

module.exports = {
  createAlert,
  getFarmerAlerts,
  updateAlert,
};
