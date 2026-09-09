/**
 * @file fertilizerService.js
 * @description Agricultural fertilizer requirement calculation engine.
 * Computes exact dosage and standard commercial bag quantities (Urea, DAP, MOP)
 * based on farmer acreage and soil test NPK deficiencies.
 */

function calculateFertilizerRequirements(farmSizeInAcres, nDeficit, pDeficit, kDeficit) {
  const acres = Number(farmSizeInAcres) || 1;

  // 1. DAP provides both Phosphorus (46%) and Nitrogen (18%)
  const requiredPPerAcre = Math.max(0, pDeficit);
  const dapKgPerAcre = requiredPPerAcre > 0 ? (requiredPPerAcre / 0.46) : 25;
  const nSuppliedByDapPerAcre = dapKgPerAcre * 0.18;

  // 2. Urea provides 46% Nitrogen
  const remainingNPerAcre = Math.max(0, nDeficit - nSuppliedByDapPerAcre);
  const ureaKgPerAcre = remainingNPerAcre > 0 ? (remainingNPerAcre / 0.46) : 45;

  // 3. MOP provides 60% Potassium
  const requiredKPerAcre = Math.max(0, kDeficit);
  const mopKgPerAcre = requiredKPerAcre > 0 ? (requiredKPerAcre / 0.60) : 20;

  // Total quantity for the whole farm
  const totalUreaKg = Math.round(ureaKgPerAcre * acres);
  const totalDapKg = Math.round(dapKgPerAcre * acres);
  const totalMopKg = Math.round(mopKgPerAcre * acres);

  // Standard packaging: Urea = 45kg bag, DAP = 50kg bag, MOP = 50kg bag
  const ureaBags = Math.ceil(totalUreaKg / 45);
  const dapBags = Math.ceil(totalDapKg / 50);
  const mopBags = Math.ceil(totalMopKg / 50);

  // Estimated Cost at Govt. Subsidized Rates (INR)
  const estimatedTotalCost = Math.round(ureaBags * 266.5 + dapBags * 1350 + mopBags * 1700);

  return {
    acreage: acres,
    fertilizers: [
      {
        fertilizer: 'Urea (46% N)',
        ratePerAcreKg: Math.round(ureaKgPerAcre),
        totalFarmKg: totalUreaKg,
        recommendedBags: ureaBags,
        bagWeightKg: 45,
        approxCostINR: Math.round(ureaBags * 266.5),
        applicationSchedule: '1/3 at basal sowing, 1/3 after 25 days, 1/3 at flowering stage.',
      },
      {
        fertilizer: 'DAP (18:46:0)',
        ratePerAcreKg: Math.round(dapKgPerAcre),
        totalFarmKg: totalDapKg,
        recommendedBags: dapBags,
        bagWeightKg: 50,
        approxCostINR: Math.round(dapBags * 1350),
        applicationSchedule: '100% applied at sowing time directly near root zone.',
      },
      {
        fertilizer: 'MOP (60% K₂O)',
        ratePerAcreKg: Math.round(mopKgPerAcre),
        totalFarmKg: totalMopKg,
        recommendedBags: mopBags,
        bagWeightKg: 50,
        approxCostINR: Math.round(mopBags * 1700),
        applicationSchedule: 'Apply during final tillage before sowing.',
      },
    ],
    estimatedTotalCostINR: estimatedTotalCost,
  };
}

module.exports = {
  calculateFertilizerRequirements,
};
