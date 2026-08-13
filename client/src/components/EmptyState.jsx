import React from 'react';

export default function EmptyState({ 
  title = "No trips found", 
  message = "You haven't added any travel memories yet. Start your journey today!", 
  actionText = "Add Your First Trip", 
  onAction 
}) {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">🗺️</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {onAction && actionText && (
        <button onClick={onAction} className="btn btn-primary empty-state-btn">
          ✨ {actionText}
        </button>
      )}
    </div>
  );
}
