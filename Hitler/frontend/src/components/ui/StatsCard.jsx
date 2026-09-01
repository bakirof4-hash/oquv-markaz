import React from 'react';

export default function StatsCard({ title, value, change, isPositive = true, icon, loading = false, error = null }) {
  if (loading) {
    return (
      <div className="stats-card skeleton-card">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line tall"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-card error-card">
        <span className="stats-title">{title}</span>
        <span className="stats-error">Ma'lumot yuklanmadi</span>
      </div>
    );
  }

  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <span className="stats-title">{title}</span>
        {icon && <div className="stats-icon">{icon}</div>}
      </div>
      <div className="stats-card-body">
        <span className="stats-value">{value}</span>
        {change && (
          <span className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
    </div>
  );
}
