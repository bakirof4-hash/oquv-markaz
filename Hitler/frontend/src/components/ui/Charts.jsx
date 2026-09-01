import React from 'react';

export function LineChart({ data = [], height = 220 }) {
  if (!data.length) return <div className="chart-empty">Ma'lumot mavjud emas</div>;

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const padding = 30;
  const width = 600;
  const points = data.map((d, idx) => {
    const x = padding + (idx * (width - 2 * padding)) / (data.length - 1 || 1);
    const y = height - padding - (d.value * (height - 2 * padding)) / maxValue;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          points={points}
        />
        {data.map((d, idx) => {
          const x = padding + (idx * (width - 2 * padding)) / (data.length - 1 || 1);
          const y = height - padding - (d.value * (height - 2 * padding)) / maxValue;
          return (
            <g key={idx} className="chart-point">
              <circle cx={x} cy={y} r="5" fill="#6366f1" />
              <text x={x} y={height - 5} textAnchor="middle" className="chart-label">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function BarChart({ data = [], height = 220 }) {
  if (!data.length) return <div className="chart-empty">Ma'lumot mavjud emas</div>;

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bar-chart-container" style={{ height }}>
      {data.map((d, idx) => {
        const heightPercent = (d.value / maxValue) * 100;
        return (
          <div key={idx} className="bar-column">
            <div className="bar-fill-wrap">
              <div
                className="bar-fill"
                style={{ height: `${heightPercent}%` }}
                title={`${d.label}: ${d.value}`}
              ></div>
            </div>
            <span className="bar-label">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
