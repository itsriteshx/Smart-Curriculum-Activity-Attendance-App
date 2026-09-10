import React from 'react';
import { FiBell } from 'react-icons/fi';

const PriceAlert = ({ cropName, targetPrice, onPriceChange, onSubmit, saved }) => {
  return (
    <div className="card">
      <h4>Set Price Alert for {cropName}</h4>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <input
          type="number"
          className="form-input"
          value={targetPrice}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="Target ₹/Quintal"
        />
        <button type="submit" className="btn btn-primary">
          <FiBell /> Alert
        </button>
      </form>
      {saved && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '6px' }}>Alert saved!</p>}
    </div>
  );
};

export default PriceAlert;
