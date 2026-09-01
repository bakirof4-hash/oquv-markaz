import React from 'react';

export default function Input({ label, error, icon, className = '', ...props }) {
  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <div className="input-wrap">
        {icon && <span className="input-icon-left">{icon}</span>}
        <input className={`admin-input ${icon ? 'has-icon-left' : ''}`} {...props} />
      </div>
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
}
