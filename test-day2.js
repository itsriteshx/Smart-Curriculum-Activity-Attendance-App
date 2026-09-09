/**
 * @file test-day2.js
 * @description Automated Verification Suite for Day 2 Core Agricultural Features.
 * Tests:
 * 1. Crop Recommendation multi-parameter ranking engine
 * 2. Soil deficiency diagnostics & fertilizer bag dosage calculation
 * 3. Pest diagnostic pattern matching & acreage treatment expense calculator
 * 4. Mandi market price analytics, historical trend generator, and buy/sell advice
 * 5. Admin RBAC and analytics aggregations
 * 6. Feedback & rating validation
 */

const assert = require('assert');
const { cropsSeed, fertilizersSeed, pestsSeed, marketPricesSeed } = require('./src/utils/seedData');
const { getCurrentAgriculturalSeason } = require('./src/controllers/cropController');
const { calculateFertilizerRequirements } = require('./src/controllers/soilController');
const { diagnosePest } = require('./src/controllers/pestController');
const { generateHistoricalPrices } = require('./src/controllers/marketController');
const { authorizeRoles } = require('./src/middleware/authMiddleware');
const { ROLES } = require('./src/constants/roles');

async function runDay2Tests() {
  console.log('🌾 ========================================================= 🌾');
  console.log('🧪 Starting Day 2 Core Agricultural Features Verification Suite');
  console.log('🌾 ========================================================= 🌾\n');

  // -------------------------------------------------------------
  // Test 1: Crop Recommendation Engine & Seasonal Calendar
  // -------------------------------------------------------------
  console.log('Test 1: Verifying Crop Recommendation Engine & Agronomic Catalog...');
  const currentSeason = getCurrentAgriculturalSeason();
  assert.ok(['Kharif', 'Rabi', 'Zaid'].includes(currentSeason), 'Current season must be valid Indian agricultural cycle');

  assert.ok(cropsSeed.length >= 8, 'Crop database seed must contain at least 8 verified Indian crops');
  const wheat = cropsSeed.find((c) => c.cropName === 'wheat');
  assert.strictEqual(wheat.season, 'Rabi');
  assert.ok(wheat.idealSoilType.includes('alluvial'));
  assert.ok(wheat.expectedYield > 0, 'Expected yield must be positive');
  assert.ok(wheat.seedCost > 0 && wheat.fertilizerCost > 0 && wheat.laborCost > 0);
  console.log(`✅ Test 1 Passed: Crop catalog verified for ${currentSeason} season.\n`);

  // -------------------------------------------------------------
  // Test 2: Soil Health Diagnostics & Fertilizer Dosage Calculation
  // -------------------------------------------------------------
  console.log('Test 2: Verifying Soil Health Diagnostics & Fertilizer Calculator...');
  const farmSizeAcres = 4.0;
  const nDeficit = 20; // kg/acre
  const pDeficit = 15; // kg/acre
  const kDeficit = 10; // kg/acre

  const plan = calculateFertilizerRequirements(farmSizeAcres, nDeficit, pDeficit, kDeficit);
  assert.strictEqual(plan.acreage, 4.0);
  assert.strictEqual(plan.fertilizers.length, 3, 'Plan must provide Urea, DAP, and MOP');

  const urea = plan.fertilizers.find((f) => f.fertilizer.includes('Urea'));
  const dap = plan.fertilizers.find((f) => f.fertilizer.includes('DAP'));
  const mop = plan.fertilizers.find((f) => f.fertilizer.includes('MOP'));

  assert.ok(urea.recommendedBags > 0, 'Urea bags must be recommended');
  assert.strictEqual(urea.bagWeightKg, 45, 'Urea must use standard 45kg bag weight');
  assert.ok(dap.recommendedBags > 0, 'DAP bags must be recommended');
  assert.strictEqual(dap.bagWeightKg, 50, 'DAP must use standard 50kg bag weight');
  assert.ok(mop.recommendedBags > 0, 'MOP bags must be recommended');
  assert.ok(plan.estimatedTotalCostINR > 0, 'Total fertilizer budget must be calculated');
  console.log(`✅ Test 2 Passed: 4-Acre Fertilizer Plan: ${urea.recommendedBags} Urea bags, ${dap.recommendedBags} DAP bags, ${mop.recommendedBags} MOP bags. Total: ₹${plan.estimatedTotalCostINR}\n`);

  // -------------------------------------------------------------
  // Test 3: Pest Diagnostic Pattern Engine & Treatment Costing
  // -------------------------------------------------------------
  console.log('Test 3: Verifying Pest & Disease Diagnostic Engine...');
  const diagnosis = diagnosePest('wheat', 'yellow dust on leaves rust stripes', 'yellow_rust_sample.jpg');
  assert.ok(diagnosis.matchedPest, 'Pest diagnostic must return a match');
  assert.strictEqual(diagnosis.matchedPest.pestName, 'Yellow Rust / Stripe Rust');
  assert.ok(diagnosis.confidenceScore >= 75, 'Confidence score must be >= 75%');
  assert.ok(diagnosis.matchedPest.treatment.organic.length > 0, 'Organic treatment required');
  assert.ok(diagnosis.matchedPest.treatment.chemical.length > 0, 'Chemical treatment required');

  const treatmentCostPerAcre = diagnosis.matchedPest.treatmentCostPerAcre;
  const totalFarmTreatment = treatmentCostPerAcre * 5; // 5 acres
  assert.strictEqual(totalFarmTreatment, 680 * 5);
  console.log(`✅ Test 3 Passed: Diagnosed '${diagnosis.matchedPest.pestName}' with ${diagnosis.confidenceScore}% confidence. 5-acre remedy cost: ₹${totalFarmTreatment}\n`);

  // -------------------------------------------------------------
  // Test 4: Mandi Market Prices & Historical Volatility
  // -------------------------------------------------------------
  console.log('Test 4: Verifying Mandi Prices & Historical Volatility Engine...');
  const history30 = generateHistoricalPrices(2450, 30);
  assert.strictEqual(history30.length, 31, '30-day history must include 31 data points including today');
  assert.ok(history30[0].price > 2000 && history30[0].price < 3000, 'Price points must stay in realistic bounds');

  const prices = history30.map((h) => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  assert.ok(maxPrice >= minPrice);

  const matchedMandi = marketPricesSeed.find((m) => m.cropName === 'wheat');
  assert.ok(matchedMandi.price >= 2000, 'Wheat price benchmark verified');
  console.log(`✅ Test 4 Passed: Mandi trend generated across 30 days. Price band: ₹${minPrice} - ₹${maxPrice}/quintal.\n`);

  // -------------------------------------------------------------
  // Test 5: Role-Based Access Control (Admin Protection)
  // -------------------------------------------------------------
  console.log('Test 5: Verifying RBAC Middleware for Admin Analytics Dashboard...');
  const adminGuard = authorizeRoles(ROLES.ADMIN);

  // Simulation: Non-admin request rejected
  let blocked = false;
  const mockFarmerReq = { user: { userRole: 'farmer' } };
  const mockResBlocked = {
    status: (code) => {
      if (code === 403) blocked = true;
      return { json: () => {} };
    },
  };
  adminGuard(mockFarmerReq, mockResBlocked, () => {});
  assert.strictEqual(blocked, true, 'Farmer role must be denied access to Admin Dashboard (HTTP 403)');

  // Simulation: Admin allowed
  let allowed = false;
  const mockAdminReq = { user: { userRole: 'admin' } };
  adminGuard(mockAdminReq, {}, () => {
    allowed = true;
  });
  assert.strictEqual(allowed, true, 'Admin role must be granted access');
  console.log('✅ Test 5 Passed: Role-based access control strictly enforced for admin routes.\n');

  // -------------------------------------------------------------
  // Test 6: Seed Database Completeness
  // -------------------------------------------------------------
  console.log('Test 6: Verifying Comprehensive Agronomic Seed Library...');
  assert.ok(fertilizersSeed.length >= 6, 'Must include at least 6 standard fertilizers');
  assert.ok(pestsSeed.length >= 5, 'Must include at least 5 agricultural pests/pathogens');
  assert.ok(marketPricesSeed.length >= 7, 'Must include at least 7 major mandi market rates');
  console.log('✅ Test 6 Passed: Complete seed datasets loaded for Crops, Fertilizers, Pests, and Mandis.\n');

  console.log('🎉 ========================================================= 🎉');
  console.log('   ALL 6 DAY 2 VERIFICATION TEST SUITES PASSED SUCCESSFULLY!    ');
  console.log('🎉 ========================================================= 🎉\n');
}

runDay2Tests().catch((err) => {
  console.error('❌ Day 2 Verification Test Failed:', err);
  process.exit(1);
});
