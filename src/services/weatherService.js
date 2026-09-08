/**
 * @file weatherService.js
 * @description Integrates OpenWeatherMap API with in-memory caching and agricultural advisory mapping.
 * Caches coordinates for 30 minutes (1800s) to minimize external API costs and rate limits.
 * 
 * Viva tip:
 * Why cache weather data?
 * Weather does not change second-by-second. By caching results with a 30-minute TTL,
 * we save external API quota, reduce network latency from ~600ms to <1ms,
 * and protect against third-party API rate-limiting or downtime.
 */

const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with 30-minute default TTL (1800 seconds)
const weatherCache = new NodeCache({ stdTTL: 1800, checkperiod: 300 });

/**
 * Parses raw OpenWeatherMap API payload into clean, friendly agricultural metrics
 * @param {object} raw - OpenWeatherMap API response
 * @returns {object} Normalized weather object
 */
const parseWeatherData = (raw) => {
  return {
    cityName: raw.name || 'Agri Field',
    country: raw.sys ? raw.sys.country : 'IN',
    coordinates: {
      latitude: raw.coord ? raw.coord.lat : 0,
      longitude: raw.coord ? raw.coord.lon : 0,
    },
    condition: raw.weather && raw.weather[0] ? raw.weather[0].main : 'Clear',
    description: raw.weather && raw.weather[0] ? raw.weather[0].description : 'clear sky',
    icon: raw.weather && raw.weather[0] ? raw.weather[0].icon : '01d',
    temperature: {
      current: raw.main ? Math.round(raw.main.temp) : 28,
      feelsLike: raw.main ? Math.round(raw.main.feels_like) : 29,
      min: raw.main ? Math.round(raw.main.temp_min) : 22,
      max: raw.main ? Math.round(raw.main.temp_max) : 34,
      unit: 'Celsius',
    },
    humidity: raw.main ? raw.main.humidity : 60, // in percentage
    pressure: raw.main ? raw.main.pressure : 1012, // in hPa
    wind: {
      speed: raw.wind ? raw.wind.speed : 3.5, // in m/s
      speedKmph: raw.wind ? Math.round(raw.wind.speed * 3.6) : 12,
      direction: raw.wind ? raw.wind.deg : 90,
    },
    rainPossibility: raw.rain ? (raw.rain['1h'] || raw.rain['3h'] || 0) : 0, // mm in last hours
    clouds: raw.clouds ? raw.clouds.all : 20, // in percentage
    visibility: raw.visibility ? raw.visibility / 1000 : 10, // km
    timestamp: new Date().toISOString(),
  };
};

/**
 * Maps parsed weather conditions to tailored agricultural advisories for Indian farming
 * @param {object} weather - Normalized weather object
 * @returns {object} Advisory recommendations
 */
const mapWeatherToRecommendations = (weather) => {
  const recommendations = [];
  const temp = weather.temperature.current;
  const humidity = weather.humidity;
  const windKmph = weather.wind.speedKmph;
  const condition = weather.condition.toLowerCase();
  const isRaining = condition.includes('rain') || condition.includes('drizzle') || weather.rainPossibility > 0;

  // 1. Irrigation Advisory
  if (isRaining) {
    recommendations.push({
      category: 'Irrigation',
      priority: 'HIGH',
      advice: 'Heavy/Moderate rain predicted or occurring. Postpone irrigation to avoid waterlogging and root rot.',
      hindiAdvice: 'वर्षा की संभावना है। जलभराव और जड़ों के सड़ने से बचने के लिए सिंचाई टालें।',
    });
  } else if (temp > 35 && humidity < 40) {
    recommendations.push({
      category: 'Irrigation',
      priority: 'HIGH',
      advice: 'High temperatures and dry conditions. Schedule light irrigation in early morning or late evening.',
      hindiAdvice: 'उच्च तापमान और शुष्क हवाएं हैं। सुबह जल्दी या शाम को हल्की सिंचाई करें।',
    });
  } else {
    recommendations.push({
      category: 'Irrigation',
      priority: 'NORMAL',
      advice: 'Optimal weather for standard crop irrigation based on crop stage.',
      hindiAdvice: 'फसल की अवस्था के अनुसार सामान्य सिंचाई के लिए अनुकूल मौसम है।',
    });
  }

  // 2. Pesticide / Fertilizer Spraying Advisory
  if (windKmph > 15) {
    recommendations.push({
      category: 'Spraying',
      priority: 'HIGH',
      advice: `Wind speed is high (${windKmph} km/h). Delay foliar pesticide/fertilizer spraying to prevent spray drift.`,
      hindiAdvice: `हवा की गति तेज (${windKmph} किमी/घंटा) है। कीटनाशक छिड़काव रोक दें।`,
    });
  } else if (isRaining) {
    recommendations.push({
      category: 'Spraying',
      priority: 'HIGH',
      advice: 'Do not spray pesticides or urea during rains; chemical runoff will waste inputs and pollute soil.',
      hindiAdvice: 'बारिश के दौरान कीटनाशक या खाद न छिड़कें; बहने से नुकसान होगा।',
    });
  } else {
    recommendations.push({
      category: 'Spraying',
      priority: 'NORMAL',
      advice: 'Wind speed is calm (<15 km/h). Ideal window for pesticide or micro-nutrient spraying.',
      hindiAdvice: 'हवा शांत है। कीटनाशक या सूक्ष्म पोषक तत्वों के छिड़काव के लिए उपयुक्त समय है।',
    });
  }

  // 3. Pest & Disease Alert
  if (humidity > 75 && temp >= 24 && temp <= 32) {
    recommendations.push({
      category: 'PestAlert',
      priority: 'MEDIUM',
      advice: 'Warm and humid conditions favor fungal leaf spot, blight, and aphid growth. Monitor underside of leaves.',
      hindiAdvice: 'उच्च नमी और अनुकूल तापमान से फंगल रोग (झुलसा/सफेद मक्खी) का खतरा बढ़ता है। पत्तियों की निगरानी करें।',
    });
  }

  // 4. Harvesting & Field Operations
  if (isRaining) {
    recommendations.push({
      category: 'Harvesting',
      priority: 'HIGH',
      advice: 'Halt mature crop harvesting. Store already harvested produce in dry, covered sheds.',
      hindiAdvice: 'पकी फसलों की कटाई रोकें। काटी गई उपज को सूखे एवं ढके स्थान पर सुरक्षित रखें।',
    });
  } else {
    recommendations.push({
      category: 'FieldWork',
      priority: 'NORMAL',
      advice: 'Weather is favorable for land preparation, weeding, and intercultural operations.',
      hindiAdvice: 'खेत की तैयारी, निराई-गुड़ाई और सामान्य कृषि कार्यों के लिए मौसम अनुकूल है।',
    });
  }

  return recommendations;
};

/**
 * Generate intelligent realistic mock weather for offline development & viva demo
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {object} Mock raw weather object matching OpenWeather structure
 */
const getMockWeatherData = (lat, lon) => {
  return {
    name: 'Demonstration Farm (Delhi NCR)',
    coord: { lat, lon },
    sys: { country: 'IN' },
    weather: [{ main: 'Clear', description: 'scattered clouds with mild sun', icon: '02d' }],
    main: {
      temp: 29.4,
      feels_like: 30.8,
      temp_min: 24.0,
      temp_max: 33.5,
      humidity: 58,
      pressure: 1010,
    },
    wind: { speed: 3.2, deg: 120 },
    clouds: { all: 25 },
    visibility: 9000,
  };
};

/**
 * Fetch weather from cache or OpenWeatherMap API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<{ weather: object, recommendations: Array, cached: boolean }>}
 */
const fetchWeatherData = async (lat, lon) => {
  // Precision rounded to 2 decimals (~1.1 km resolution) for better cache hit rates
  const roundedLat = parseFloat(lat).toFixed(2);
  const roundedLon = parseFloat(lon).toFixed(2);
  const cacheKey = `weather_${roundedLat}_${roundedLon}`;

  // Check in-memory cache first
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData) {
    return {
      ...cachedData,
      cached: true,
      cacheSource: 'memory-cache',
    };
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  let rawData;

  if (apiKey && apiKey !== 'your_openweathermap_api_key_here' && apiKey.trim().length > 0) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await axios.get(url, { timeout: 6000 });
      rawData = response.data;
    } catch (apiErr) {
      console.warn(`⚠️  OpenWeatherMap API request failed (${apiErr.message}). Serving fallback smart mock.`);
      rawData = getMockWeatherData(lat, lon);
    }
  } else {
    // API key not yet set in .env: use smart simulated weather
    rawData = getMockWeatherData(lat, lon);
  }

  const weather = parseWeatherData(rawData);
  const recommendations = mapWeatherToRecommendations(weather);

  const payload = {
    weather,
    recommendations,
    cached: false,
  };

  // Store in cache for 30 minutes
  weatherCache.set(cacheKey, payload);

  return payload;
};

module.exports = {
  fetchWeatherData,
  parseWeatherData,
  mapWeatherToRecommendations,
  weatherCache,
};
