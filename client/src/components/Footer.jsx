import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">🗺️ TripVault</span>
          <p className="footer-tagline">Preserve, manage, and share your travel memories around the globe.</p>
        </div>

        <div className="footer-info">
          <div className="footer-links">
            <a 
              href="https://github.com/manjunathak/TripVault" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              💻 GitHub Repository
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TripVault. Built with Full Stack MERN (MongoDB, Express, React, Node.js)</p>
      </div>
    </footer>
  );
}
