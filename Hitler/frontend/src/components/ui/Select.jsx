import React from 'react';

export default function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <select className="admin-select" {...props}>
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
}
