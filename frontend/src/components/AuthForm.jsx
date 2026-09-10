import React from 'react';

const AuthForm = ({ title, subtitle, children, onSubmit, error }) => {
  return (
    <div className="auth-form-card">
      <div className="auth-form-header">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {error && <div className="auth-error-banner">⚠️ {error}</div>}
      <form onSubmit={onSubmit} className="auth-form-body">
        {children}
      </form>
    </div>
  );
};

export default AuthForm;
