/**
 * @file recommendationEngine.js
 * @description Core agronomic crop recommendation algorithm.
 * Evaluates seasonal compatibility, soil affinity, climate temperature thresholds,
 * farm irrigation hydrology, and calculates net profitability per acre.
 */

const { cropsSeed } = require('../utils/seedData');

function getCurrentAgriculturalSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 11 || month <= 3) return 'Rabi';
  return 'Zaid';
}

function scoreAndRankCrops({ candidateCrops = cropsSeed, farmerSoil = 'alluvial', farmerWater = 'canal', currentTemp = 26, currentSeason }) {
  const season = currentSeason || getCurrentAgriculturalSeason();

  const scoredCrops = candidateCrops.map((crop) => {
    let score = 0;
    const reasons = [];

    // Parameter A: Season Alignment (Weight: 30)
    if (crop.season === season || crop.season === 'All-Season' || crop.season === 'Perennial') {
      score += 30;
      reasons.push(`Optimal sowing season (${crop.season})`);
    } else {
      score += 5;
    }

    // Parameter B: Soil Affinity (Weight: 25)
    const soilMatches = crop.idealSoilType.includes(farmerSoil.toLowerCase());
    if (soilMatches) {
      score += 25;
      reasons.push(`Thrives in ${farmerSoil} soil`);
    } else {
      score += 8;
    }

    // Parameter C: Temperature Suitability (Weight: 20)
    if (currentTemp >= crop.temperature.min && currentTemp <= crop.temperature.max) {
      score += 20;
      reasons.push(`Current temperature (${currentTemp}°C) within ideal growth range (${crop.temperature.min}-${crop.temperature.max}°C)`);
    } else {
      score += 5;
    }

    // Parameter D: Water Requirement vs Source (Weight: 15)
    if (crop.waterRequirement > 1000) {
      if (['borewell', 'canal', 'drip'].includes(farmerWater.toLowerCase())) {
        score += 15;
        reasons.push('Irrigation infrastructure supports high water requirement');
      } else {
        score += 5;
      }
    } else {
      score += 15;
      reasons.push('Low-to-moderate water requirement suits farm hydrology');
    }

    // Parameter E: Net Profitability Index (Weight: 10)
    const estimatedPricePerQuintal = crop.cropName === 'cotton' ? 7000 : crop.cropName === 'wheat' ? 2450 : crop.cropName === 'rice' ? 3600 : 3000;
    const estimatedGrossRevenue = crop.expectedYield * estimatedPricePerQuintal;
    const totalInputCost = crop.seedCost + crop.fertilizerCost + crop.laborCost;
    const netProfitPerAcre = estimatedGrossRevenue - totalInputCost;

    if (netProfitPerAcre > 40000) score += 10;
    else if (netProfitPerAcre > 25000) score += 7;
    else score += 4;

    return {
      cropId: crop._id || crop.cropName,
      cropName: crop.cropName,
      displayName: crop.displayName,
      season: crop.season,
      expectedYieldPerAcre: crop.expectedYield,
      netProfitPerAcreEstimate: netProfitPerAcre,
      harvestingPeriodDays: crop.harvestingPeriod,
      suitabilityScore: Math.min(100, score),
      reasons,
      agronomicTips: crop.description,
    };
  });

  scoredCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  return {
    currentSeason: season,
    topCrops: scoredCrops.slice(0, 5),
    allScored: scoredCrops,
  };
}

module.exports = {
  getCurrentAgriculturalSeason,
  scoreAndRankCrops,
};
