import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../api/config';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: 'transparent', width: '0%' };
    if (pass.length < 6) return { label: 'Weak (min 6 chars)', color: '#f43f5e', width: '33%' };
    if (pass.length < 10) return { label: 'Medium', color: '#f59e0b', width: '66%' };
    return { label: 'Strong', color: '#10b981', width: '100%' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      toast.warning('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/register', formData);
      toast.success('🎉 Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setLoading(false);
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(`Registration failed: ${msg}`);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="brand-header">
          <span className="logo-icon">🗺️</span>
          <h1 className="logo-title">Join TripVault</h1>
          <p className="subtitle">Start cataloging your travels and memories.</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="error-alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              placeholder="e.g., Alex Johnson"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Username (for public profile)</label>
            <input
              type="text"
              placeholder="alexjohnson"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              placeholder="alex@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-btn"
              >
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="strength-container">
                <div className="strength-bar-bg">
                  <div 
                    className="strength-bar-fill"
                    style={{
                      width: strength.width,
                      backgroundColor: strength.color
                    }} 
                  />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-emerald btn-block"
          >
            {loading ? '⏳ Creating Account...' : 'Create My Vault →'}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already registered?{' '}
            <Link to="/login" className="auth-link">
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}