import React from 'react';

export default function SkeletonCard({ count = 3 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image pulse"></div>
          <div className="skeleton-body">
            <div className="skeleton-title pulse"></div>
            <div className="skeleton-line pulse"></div>
            <div className="skeleton-line short pulse"></div>
            <div className="skeleton-footer pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
