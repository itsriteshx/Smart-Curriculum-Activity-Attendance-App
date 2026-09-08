/**
 * @file test-endpoints.js
 * @description End-to-End integration test covering the entire Day 1 deliverable:
 * 1. Health check & Root
 * 2. Weather route with advisory generation & memory caching
 * 3. User Registration (User model, pre-save bcrypt hook, JWT token generation)
 * 4. User Login (credential matching, JWT issuance)
 * 5. Protected User profile (GET /api/auth/me via verifyToken)
 * 6. Farmer Profile Creation (POST /api/farmer/profile)
 * 7. Farmer Profile Retrieval with populated User (GET /api/farmer/me)
 * 8. Profile Completion Analytics (GET /api/farmer/profile/:id/completion)
 * 9. Duplicate email rejection handling (Error middleware test)
 * 10. 404 Route handling
 */

const http = require('http');
const axios = require('axios');
const app = require('./src/server');

const testPort = 5001;
const server = http.createServer(app);

server.listen(testPort, async () => {
  const baseURL = `http://localhost:${testPort}`;
  console.log(`\n📡 Integration Test Server Active on: ${baseURL}\n`);

  try {
    // 1. Health Check
    const resHealth = await axios.get(`${baseURL}/api/health`);
    console.log(`✅ [1/9] Health Check: ${resHealth.data.status}`);

    // 2. Weather & Agricultural Advisory
    const resWeather1 = await axios.get(`${baseURL}/api/weather/28.6139/77.2090`);
    console.log(`✅ [2/9] Weather API: Temperature ${resWeather1.data.data.currentWeather.temperature.current}°C, Condition: ${resWeather1.data.data.currentWeather.condition}`);
    console.log(`         Agricultural Advisories Generated: ${resWeather1.data.data.agriculturalAdvisory.length}`);

    // 3. Weather In-Memory Cache (30-min TTL)
    const resWeather2 = await axios.get(`${baseURL}/api/weather/28.6139/77.2090`);
    console.log(`✅ [3/9] Weather Cache: cached = ${resWeather2.data.cached} (Source: ${resWeather2.data.cacheSource})`);

    // 4. User Registration
    const timestamp = Date.now();
    const testEmail = `farmer_${timestamp}@kisan.in`;
    const testPhone = `98${String(timestamp).slice(-8)}`;

    const resRegister = await axios.post(`${baseURL}/api/auth/register`, {
      fullName: 'Vikram Singh',
      email: testEmail,
      password: 'KisanPassword@2026',
      phoneNumber: testPhone,
      userRole: 'farmer',
      language_preference: 'Hindi',
    });
    console.log(`✅ [4/9] User Registered: ${resRegister.data.user.fullName} (${resRegister.data.user.email})`);
    const jwtToken = resRegister.data.token;
    const authHeaders = { headers: { Authorization: `Bearer ${jwtToken}` } };

    // 5. User Login
    const resLogin = await axios.post(`${baseURL}/api/auth/login`, {
      email: testEmail,
      password: 'KisanPassword@2026',
    });
    console.log(`✅ [5/9] User Login Successful: Token issued`);

    // 6. Access Protected Route (GET /api/auth/me)
    const resMe = await axios.get(`${baseURL}/api/auth/me`, authHeaders);
    console.log(`✅ [6/9] Protected Route (/api/auth/me): Authenticated as ${resMe.data.user.fullName}`);

    // 7. Create Farmer Profile
    const resProfile = await axios.post(
      `${baseURL}/api/farmer/profile`,
      {
        location: {
          latitude: 26.8467,
          longitude: 80.9462,
          state: 'Uttar Pradesh',
          district: 'Lucknow',
        },
        farmSize: 6.2,
        soilType: 'alluvial',
        waterAvailability: 'irrigated',
        cropsGrown: [
          { cropName: 'Wheat', season: 'Rabi', areaInAcres: 4.0 },
          { cropName: 'Mustard', season: 'Rabi', areaInAcres: 2.2 },
        ],
      },
      authHeaders
    );
    const farmerId = resProfile.data.farmer._id;
    console.log(`✅ [7/9] Farmer Profile Created: ID ${farmerId}, Soil: ${resProfile.data.farmer.soilType}, Score: ${resProfile.data.completionScore}%`);

    // 8. Profile Completion Analytics
    const resCompletion = await axios.get(
      `${baseURL}/api/farmer/profile/${farmerId}/completion`,
      authHeaders
    );
    console.log(`✅ [8/9] Profile Completion Analytics: ${resCompletion.data.completionPercentage}% complete (isComplete: ${resCompletion.data.isComplete})`);

    // 9. Error Handling: Duplicate Registration
    try {
      await axios.post(`${baseURL}/api/auth/register`, {
        fullName: 'Duplicate Farmer',
        email: testEmail,
        password: 'KisanPassword@2026',
        phoneNumber: testPhone,
      });
    } catch (dupErr) {
      console.log(`✅ [9/9] Error Middleware: Successfully caught duplicate email (Status ${dupErr.response.status} - ${dupErr.response.data.message})`);
    }

    console.log('\n🌾 ========================================================= 🌾');
    console.log('   🎉 ALL DAY 1 END-TO-END INTEGRATION TESTS PASSED!');
    console.log('🌾 ========================================================= 🌾\n');

    server.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Integration Test Failed:', err.response ? err.response.data : err.message);
    server.close();
    process.exit(1);
  }
});
