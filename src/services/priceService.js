/**
 * @file priceService.js
 * @description Mandi market pricing analytics and volatility trend service.
 */

function generateHistoricalPrices(basePrice, daysCount = 30) {
  const history = [];
  const today = new Date();

  for (let i = daysCount; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const fluctuationPercent = Math.sin(i / 3) * 0.04 + (Math.random() * 0.02 - 0.01);
    const dayPrice = Math.round(basePrice * (1 + fluctuationPercent));

    history.push({
      date: d.toISOString().split('T')[0],
      price: dayPrice,
      minPrice: Math.round(dayPrice * 0.96),
      maxPrice: Math.round(dayPrice * 1.04),
      volumeQuintals: Math.round(150 + Math.random() * 300),
    });
  }

  return history;
}

module.exports = {
  generateHistoricalPrices,
};
