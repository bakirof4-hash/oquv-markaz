import React from 'react';

export default function Badge({ children, variant = 'info', className = '' }) {
  return (
    <span className={`admin-badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}
