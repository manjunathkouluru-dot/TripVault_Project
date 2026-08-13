import React from 'react';

export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-alert-banner">
      <div className="error-alert-content">
        <span className="error-alert-icon">⚠️</span>
        <span className="error-alert-text">{message}</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-retry">
          🔄 Retry
        </button>
      )}
    </div>
  );
}
