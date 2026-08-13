import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../api/config';

export default function Login() {
  const [formData, setFormData] = useState({
    email: 'demo@tripvault.com',
    password: 'password123',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuickLogin = async () => {
    setFormData({ email: 'demo@tripvault.com', password: 'password123' });
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', {
        email: 'demo@tripvault.com',
        password: 'password123',
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success(`👋 Welcome back, ${res.data.user?.fullName || res.data.user?.name || 'Traveler'}!`);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(`Login failed: ${msg}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success(`👋 Welcome back!`);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(`Login failed: ${msg}`);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="brand-header">
          <span className="logo-icon">🗺️</span>
          <h1 className="logo-title">TripVault</h1>
          <p className="subtitle">Welcome back! Access your travel memories.</p>
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
            <label className="input-label">Email Address</label>
            <input
              type="email"
              placeholder="user@example.com"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-emerald btn-block"
          >
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>

          <button
            type="button"
            onClick={handleQuickLogin}
            className="btn btn-outline-cyan btn-block"
          >
            ⚡ Quick Demo Login
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}