import React from 'react';

export default function Button({ children, variant = 'primary', size = 'md', loading = false, disabled = false, icon, className = '', ...props }) {
  return (
    <button
      className={`admin-btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner"></span>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
