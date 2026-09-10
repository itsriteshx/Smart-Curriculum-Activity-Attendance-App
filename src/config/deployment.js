/**
 * @file deployment.js
 * @description Deployment and environment configuration loader
 */

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_agriculture_db',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_key_2026',
  openWeatherKey: process.env.OPENWEATHER_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
