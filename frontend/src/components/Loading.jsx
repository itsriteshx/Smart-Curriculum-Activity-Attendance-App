import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ fontSize: '2rem', animation: 'spin 1.5s linear infinite', marginBottom: '8px' }}>🌾</div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
};

export default Loading;
