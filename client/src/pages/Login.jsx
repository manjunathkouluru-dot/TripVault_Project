import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: 'manjunatha@example.com',
    password: 'password123',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuickLogin = async () => {
    setFormData({ email: 'manjunatha@example.com', password: 'password123' });
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'manjunatha@example.com',
        password: 'password123',
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      
      // Save user details so the Dashboard can display registered name and email
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Brief delay for smooth interaction feedback
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        {/* Brand Header */}
        <div style={styles.brandHeader}>
          <span style={styles.logoIcon}>✈️</span>
          <h1 style={styles.logoTitle}>TripVault</h1>
          <p style={styles.subtitle}>Welcome back! Access your travel memories.</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={styles.errorAlert}>
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="manjunatha@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePasswordBtn}
              >
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Sign In as Manjunatha K →'}
          </button>

          <button
            type="button"
            onClick={handleQuickLogin}
            style={{
              backgroundColor: '#1e3a5f',
              color: '#00f2fe',
              border: '1px solid #00f2fe',
              padding: '10px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            ⚡ Quick Demo Login (Manjunatha K)
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <p>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Inline Styles Object
const styles = {
  pageContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#0b1329',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background: 'radial-gradient(circle at top left, #1a233a, #0b1329)',
  },
  card: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '16px',
    padding: '36px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 30px -10px rgba(0, 242, 254, 0.1)',
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoIcon: {
    fontSize: '42px',
    display: 'block',
    marginBottom: '8px',
  },
  logoTitle: {
    margin: '0',
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #4facfe, #00f2fe)', // Cyan electric gradient
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    margin: '6px 0 0 0',
    color: '#94a3b8',
    fontSize: '14px',
  },
  errorAlert: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    border: '1px solid #f43f5e',
    color: '#fb7185',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#00f2fe',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #1e3a5f',
    backgroundColor: '#0a1120',
    color: '#ffffff',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  togglePasswordBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#38bdf8',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  submitBtn: {
    backgroundColor: '#10b981', // Vibrant Emerald button
    color: '#ffffff',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    borderTop: '1px solid #1e3a5f',
    paddingTop: '18px',
    fontSize: '14px',
    color: '#94a3b8',
  },
  link: {
    color: '#00f2fe',
    textDecoration: 'none',
    fontWeight: '600',
  },
};