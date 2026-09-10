import React from 'react';
import { Line } from 'react-chartjs-2';

const PriceChart = ({ data, options }) => {
  return (
    <div style={{ height: '260px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
