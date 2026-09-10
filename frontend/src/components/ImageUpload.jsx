import React from 'react';
import { FiUploadCloud } from 'react-icons/fi';

const ImageUpload = ({ onFileSelect }) => {
  return (
    <div
      style={{
        border: '2px dashed var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '30px',
        textAlign: 'center',
        cursor: 'pointer',
      }}
      onClick={() => document.getElementById('pest-file-input').click()}
    >
      <input
        type="file"
        id="pest-file-input"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => onFileSelect(e.target.files[0])}
      />
      <FiUploadCloud size={36} color="var(--primary-500)" />
      <p style={{ marginTop: '8px', fontWeight: 600 }}>Click to upload leaf photo</p>
    </div>
  );
};

export default ImageUpload;
