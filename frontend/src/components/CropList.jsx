import React from 'react';
import CropCard from './CropCard';

const CropList = ({ crops, onSelectCrop }) => {
  return (
    <div className="grid-2">
      {crops.map((crop) => (
        <CropCard key={crop._id} crop={crop} onSelect={onSelectCrop} />
      ))}
    </div>
  );
};

export default CropList;
