import React from 'react';

const FertilizerCalc = ({ fertPlan, acres, onAcresChange }) => {
  return (
    <div className="card">
      <h3>Fertilizer Calculator</h3>
      <input
        type="number"
        className="form-input"
        value={acres}
        onChange={(e) => onAcresChange(e.target.value)}
        placeholder="Farm size in acres"
        style={{ margin: '12px 0' }}
      />
      {fertPlan && (
        <div style={{ fontSize: '0.9rem' }}>
          <p>Urea (45kg): <strong>{fertPlan.ureaBags} bags</strong></p>
          <p>DAP (50kg): <strong>{fertPlan.dapBags} bags</strong></p>
          <p>MOP (50kg): <strong>{fertPlan.mopBags} bags</strong></p>
          <p style={{ marginTop: '8px', fontWeight: 700, color: 'var(--primary-600)' }}>
            Est. Cost: ₹{fertPlan.totalCost}
          </p>
        </div>
      )}
    </div>
  );
};

export default FertilizerCalc;
