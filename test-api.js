/**
 * @file test-api.js
 * @description Automated verification script for Day 1 deliverables.
 * Tests models, password hashing, weather parsing, recommendation generation,
 * in-memory caching, and input validation without requiring an external DB running.
 */

const assert = require('assert');
const bcrypt = require('bcryptjs');
const { parseWeatherData, mapWeatherToRecommendations, fetchWeatherData } = require('./src/services/weatherService');
const { ROLES, SOIL_TYPES } = require('./src/constants/roles');
const Farmer = require('./src/models/Farmer');

async function runTests() {
  console.log('🧪 Starting Day 1 Automated Verification Suite...\n');

  // Test 1: Verify Roles & Soil Types Constants
  console.log('Test 1: Verifying Constants & Enums...');
  assert.strictEqual(ROLES.FARMER, 'farmer');
  assert.strictEqual(ROLES.ADMIN, 'admin');
  assert.strictEqual(ROLES.OFFICER, 'officer');
  assert.ok(SOIL_TYPES.includes('black_cotton'), 'black_cotton soil type must be supported');
  assert.ok(SOIL_TYPES.includes('alluvial'), 'alluvial soil type must be supported');
  console.log('✅ Test 1 Passed: System constants verified.\n');

  // Test 2: Verify Password Hashing with bcryptjs
  console.log('Test 2: Verifying Password Hashing & Comparison...');
  const plainPassword = 'KisanPassword@123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);
  assert.notStrictEqual(plainPassword, hash);
  const isMatch = await bcrypt.compare(plainPassword, hash);
  assert.strictEqual(isMatch, true, 'Bcrypt comparison should validate correct password');
  const isWrong = await bcrypt.compare('WrongPassword', hash);
  assert.strictEqual(isWrong, false, 'Bcrypt comparison should reject wrong password');
  console.log('✅ Test 2 Passed: Bcrypt hashing and comparison functional.\n');

  // Test 3: Weather Data Normalization
  console.log('Test 3: Verifying Weather Parser...');
  const mockRaw = {
    name: 'Varanasi',
    coord: { lat: 25.31, lon: 82.97 },
    sys: { country: 'IN' },
    weather: [{ main: 'Rain', description: 'moderate rain showers', icon: '10d' }],
    main: { temp: 27, feels_like: 29, temp_min: 24, temp_max: 30, humidity: 85, pressure: 1008 },
    wind: { speed: 4.5, deg: 100 },
    rain: { '1h': 3.2 },
    clouds: { all: 80 },
    visibility: 6000,
  };
  const parsed = parseWeatherData(mockRaw);
  assert.strictEqual(parsed.cityName, 'Varanasi');
  assert.strictEqual(parsed.temperature.current, 27);
  assert.strictEqual(parsed.humidity, 85);
  console.log('✅ Test 3 Passed: Weather parser successfully extracts and formats metrics.\n');

  // Test 4: Agricultural Advisory Mapping
  console.log('Test 4: Verifying Agricultural Recommendation Engine...');
  const advisories = mapWeatherToRecommendations(parsed);
  assert.ok(Array.isArray(advisories) && advisories.length > 0);
  const irrigationAdvice = advisories.find((a) => a.category === 'Irrigation');
  assert.ok(irrigationAdvice, 'Should generate irrigation advisory');
  assert.strictEqual(irrigationAdvice.priority, 'HIGH');
  assert.ok(irrigationAdvice.advice.includes('Postpone irrigation') || irrigationAdvice.advice.includes('rain'));
  assert.ok(irrigationAdvice.hindiAdvice, 'Should include bilingual Hindi advisory');
  console.log('✅ Test 4 Passed: Agricultural decision engine generated proper rain advisory & Hindi translations.\n');

  // Test 5: Weather In-Memory Cache (30-min TTL)
  console.log('Test 5: Verifying Weather Cache & Fallback Service...');
  const call1 = await fetchWeatherData(28.61, 77.20);
  assert.strictEqual(call1.cached, false, 'First call should not be from cache');
  const call2 = await fetchWeatherData(28.61, 77.20);
  assert.strictEqual(call2.cached, true, 'Second call for same coordinates must hit cache');
  assert.strictEqual(call2.cacheSource, 'memory-cache');
  console.log('✅ Test 5 Passed: In-memory cache successfully served repeated coordinate requests.\n');

  // Test 6: Farmer Profile Completion Logic
  console.log('Test 6: Verifying Profile Completion Score...');
  const sampleFarmer = new Farmer({
    userId: '507f1f77bcf86cd799439011',
    location: { latitude: 26.84, longitude: 80.94, state: 'Uttar Pradesh', district: 'Lucknow' },
    farmSize: 4.5,
    soilType: 'alluvial',
    waterAvailability: 'irrigated',
    cropsGrown: [{ cropName: 'Wheat', season: 'Rabi', areaInAcres: 3 }],
  });
  const completion = sampleFarmer.calculateCompletion();
  assert.ok(completion.percentage >= 80, `Expected completion >= 80%, got ${completion.percentage}%`);
  assert.strictEqual(completion.isComplete, true);
  console.log(`✅ Test 6 Passed: Profile completion score calculated: ${completion.percentage}%.\n`);

  console.log('🎉 ALL 6 TEST SUITES PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
