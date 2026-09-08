/**
 * @file weatherController.js
 * @description Controller serving real-time agro-meteorological intelligence.
 * Queries weather data, checks memory cache, and formats crop-specific recommendations.
 * 
 * Viva tip:
 * Why combine weather with agronomic advisory?
 * Raw data like 'humidity 82%, temp 30°C' is not actionable for a smallholder farmer.
 * Mapping this data to 'High fungal blight risk - postpone irrigation and monitor leaves'
 * transforms raw telemetry into life-saving agricultural decision support.
 */

const { fetchWeatherData } = require('../services/weatherService');
const { SUCCESS_MESSAGES } = require('../constants/messages');

/**
 * @route   GET /api/weather/:lat/:long
 * @desc    Fetch weather information and crop advisory recommendations for given GPS coordinates
 * @access  Public (or Private with token)
 */
const getWeatherByCoordinates = async (req, res, next) => {
  try {
    const { lat, long } = req.parsedCoords || {
      lat: parseFloat(req.params.lat),
      long: parseFloat(req.params.long),
    };

    const data = await fetchWeatherData(lat, long);

    return res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.WEATHER_FETCHED,
      cached: data.cached,
      cacheSource: data.cacheSource || 'fresh-api-call',
      data: {
        location: {
          latitude: lat,
          longitude: long,
          city: data.weather.cityName,
          country: data.weather.country,
        },
        currentWeather: data.weather,
        agriculturalAdvisory: data.recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeatherByCoordinates,
};
