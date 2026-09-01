import React from 'react';

export default function Loader({ text = "Yuklanmoqda..." }) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      {text && <span className="loader-text">{text}</span>}
    </div>
  );
}
