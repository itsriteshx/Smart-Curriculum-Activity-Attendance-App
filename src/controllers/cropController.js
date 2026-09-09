/**
 * @file cropController.js
 * @description Controller handling Crop Recommendations and Agronomic Directory Queries.
 * Implements intelligent multi-variable ranking: Season matching + Soil compatibility +
 * Temperature tolerance + Net Profitability Index + Water availability.
 */

const Crop = require('../models/Crop');
const Farmer = require('../models/Farmer');
const MarketPrice = require('../models/MarketPrice');
const { fetchWeatherData } = require('../services/weatherService');
const { cropsSeed } = require('../utils/seedData');
const { scoreAndRankCrops, getCurrentAgriculturalSeason } = require('../services/recommendationEngine');

// Agricultural season helper is imported from recommendationEngine

/**
 * @route   GET /api/crops/recommend/:farmerId
 * @desc    Generate top 5 recommended crops tailored for a farmer's farm profile and weather
 * @access  Private
 */
const recommendCrops = async (req, res, next) => {
  try {
    const { farmerId } = req.params;

    // 1. Fetch farmer profile
    let farmer = await Farmer.findById(farmerId).populate('userId', 'fullName state district');
    if (!farmer) {
      // Check if farmerId was passed as userId
      farmer = await Farmer.findOne({ userId: farmerId }).populate('userId', 'fullName state district');
    }

    // Default farmer attributes fallback if testing standalone
    const farmerSoil = farmer?.soilType || 'alluvial';
    const farmerWater = farmer?.irrigationSource || 'canal';
    const farmState = farmer?.location?.state || 'Punjab';
    const lat = farmer?.location?.latitude || 28.61;
    const lon = farmer?.location?.longitude || 77.20;

    // 2. Fetch local weather
    let weatherMetrics = { temperature: 26, humidity: 60 };
    try {
      const weatherData = await fetchWeatherData(lat, lon);
      weatherMetrics = {
        temperature: weatherData.temperature?.current || 26,
        humidity: weatherData.humidity || 60,
      };
    } catch (err) {
      console.warn('Weather fetch fallback engaged for crop recommendation:', err.message);
    }

    const currentSeason = getCurrentAgriculturalSeason();

    // 3. Fetch candidate crops from database or fallback to rich seed catalog
    let candidateCrops = await Crop.find({});
    if (!candidateCrops || candidateCrops.length === 0) {
      candidateCrops = cropsSeed;
    }

    const { topCrops } = scoreAndRankCrops({
      candidateCrops,
      farmerSoil,
      farmerWater,
      currentTemp: weatherMetrics.temperature,
      currentSeason,
    });

    return res.status(200).json({
      success: true,
      message: 'Top crop recommendations generated successfully.',
      currentSeason,
      localTemperature: `${weatherMetrics.temperature}°C`,
      farmerSoil,
      recommendationsCount: topCrops.length,
      recommendations: topCrops,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/crops/:cropId
 * @desc    Retrieve detailed agronomic profile for a specific crop
 * @access  Public
 */
const getCropDetails = async (req, res, next) => {
  try {
    const { cropId } = req.params;

    let crop = null;
    if (cropId.match(/^[0-9a-fA-F]{24}$/)) {
      crop = await Crop.findById(cropId);
    }
    if (!crop) {
      crop = await Crop.findOne({ cropName: cropId.toLowerCase() });
    }
    if (!crop) {
      crop = cropsSeed.find((c) => c.cropName === cropId.toLowerCase());
    }

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: `Crop with identifier '${cropId}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/crops/region/:state/:district
 * @desc    Retrieve crops traditionally suitable for a specific state & district
 * @access  Public
 */
const getCropsByRegion = async (req, res, next) => {
  try {
    const { state } = req.params;
    const regexState = new RegExp(state, 'i');

    let crops = await Crop.find({
      suitableStates: { $in: [regexState] },
    });

    if (!crops || crops.length === 0) {
      crops = cropsSeed.filter((c) =>
        c.suitableStates.some((s) => s.toLowerCase().includes(state.toLowerCase()))
      );
    }

    return res.status(200).json({
      success: true,
      count: crops.length,
      state,
      crops,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/crops/seasonal/:season
 * @desc    Filter crops by seasonal cycle (Kharif, Rabi, Zaid, etc.)
 * @access  Public
 */
const getSeasonalCrops = async (req, res, next) => {
  try {
    const { season } = req.params;
    const regexSeason = new RegExp(`^${season}$`, 'i');

    let crops = await Crop.find({ season: regexSeason });
    if (!crops || crops.length === 0) {
      crops = cropsSeed.filter((c) => c.season.toLowerCase() === season.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      season,
      count: crops.length,
      crops,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  recommendCrops,
  getCropDetails,
  getCropsByRegion,
  getSeasonalCrops,
  getCurrentAgriculturalSeason,
};
