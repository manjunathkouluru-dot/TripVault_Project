import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const username = user?.username || JSON.parse(localStorage.getItem('user') || '{}')?.username || '';

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-logo">🗺️</span>
          <span className="brand-title">TripVault</span>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {!isAuthPage && (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                🏠 Dashboard
              </Link>

              {username && (
                <Link 
                  to={`/profile/${username}`} 
                  className={`nav-link ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🌐 Public Profile
                </Link>
              )}
            </>
          )}

          <div className="navbar-right">
            {!isAuthPage && user && (
              <span className="user-badge">
                👤 {user.fullName || user.username || 'Traveler'}
              </span>
            )}

            {!isAuthPage ? (
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm logout-btn"
              >
                🚪 Logout
              </button>
            ) : (
              <div className="auth-nav-links">
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
