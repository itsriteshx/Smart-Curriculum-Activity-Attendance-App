import React from 'react';

const SoilAnalysis = ({ data }) => {
  return (
    <div className="grid-4">
      <div className="card">
        <h4>Nitrogen (N)</h4>
        <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>185 kg/ha</p>
        <span className="badge badge-danger">Deficient</span>
      </div>
      <div className="card">
        <h4>Phosphorus (P)</h4>
        <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>34 kg/ha</p>
        <span className="badge badge-warning">Medium</span>
      </div>
      <div className="card">
        <h4>Potassium (K)</h4>
        <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>240 kg/ha</p>
        <span className="badge badge-success">Optimal</span>
      </div>
      <div className="card">
        <h4>Soil pH</h4>
        <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>6.8</p>
        <span className="badge badge-info">Neutral</span>
      </div>
    </div>
  );
};

export default SoilAnalysis;
