import React from 'react';

export default function Spinner({ size = 'medium', text = 'Loading...' }) {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner-ring"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
