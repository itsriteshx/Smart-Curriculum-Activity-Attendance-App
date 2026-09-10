import React from 'react';

const ProfileForm = ({ formData, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="card">
      <h3>Farmer Farm Details</h3>
      <div className="grid-2" style={{ margin: '14px 0' }}>
        <input
          type="text"
          className="form-input"
          value={formData?.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Farmer Name"
        />
        <input
          type="tel"
          className="form-input"
          value={formData?.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="Phone Number"
        />
      </div>
      <button type="submit" className="btn btn-primary">Save Profile</button>
    </form>
  );
};

export default ProfileForm;
