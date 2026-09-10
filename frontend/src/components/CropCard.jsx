import React from 'react';
import SpeakButton from './SpeakButton';

const CropCard = ({ crop, onSelect }) => {
  return (
    <div className="card" onClick={() => onSelect && onSelect(crop)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4>{crop.name}</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{crop.variety}</span>
        </div>
        <span className="badge badge-success">{crop.suitabilityScore}% Match</span>
      </div>
      <div style={{ margin: '12px 0', fontSize: '0.85rem' }}>
        <p>Yield: <strong>{crop.expectedYield}</strong></p>
        <p>Est. Profit: <strong style={{ color: 'var(--primary-600)' }}>₹{crop.estimatedProfit}</strong></p>
      </div>
      <SpeakButton textToRead={`${crop.name}. Suitability match ${crop.suitabilityScore} percent.`} />
    </div>
  );
};

export default CropCard;
