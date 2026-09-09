/**
 * @file pestClassification.js
 * @description Pattern recognition and diagnostic classification engine for crop pests and diseases.
 * Matches symptoms, affected crop species, seasonal cycles, and confidence scores.
 */

const { pestsSeed } = require('../utils/seedData');

function diagnosePest(cropName, observedSymptoms, fileName = '') {
  const normalizedCrop = (cropName || 'wheat').toLowerCase();
  const searchCorpus = `${normalizedCrop} ${observedSymptoms || ''} ${fileName || ''}`.toLowerCase();

  let bestMatch = pestsSeed[0];
  let highestScore = 0;

  for (const pest of pestsSeed) {
    let score = 0;

    const cropMatches = pest.affectedCrops.some((c) => normalizedCrop.includes(c) || c.includes(normalizedCrop));
    if (cropMatches) score += 40;

    const keywords = pest.symptoms.toLowerCase().split(/[ ,;.]+/);
    for (const kw of keywords) {
      if (kw.length > 3 && searchCorpus.includes(kw)) {
        score += 8;
      }
    }

    if (searchCorpus.includes(pest.pestName.toLowerCase())) {
      score += 35;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = pest;
    }
  }

  let confidenceScore = 80;
  if (highestScore >= 50) confidenceScore = 94;
  else if (highestScore >= 35) confidenceScore = 88;
  else if (highestScore >= 20) confidenceScore = 82;
  else confidenceScore = 76;

  return {
    matchedPest: bestMatch,
    confidenceScore,
  };
}

module.exports = {
  diagnosePest,
};
