import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  // Safely parse user details from localStorage
  const getUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    try {
      const parsed = JSON.parse(storedUser);
      // Support nested objects (e.g., if saved as { user: { name, email } })
      const actualUser = parsed.user || parsed;

      return {
        fullName: actualUser.fullName || actualUser.name || actualUser.username || '',
        email: actualUser.email || '',
      };
    } catch (err) {
      console.error('Failed to parse user data from localStorage', err);
      return null;
    }
  };

  const user = getUserData();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div
      style={{
        backgroundColor: '#d3dde1',
        minHeight: '100vh',
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '48px',
          maxWidth: '700px',
          width: '90%',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✈️</div>

        {/* Header split into title and username with explicit spacing */}
        <h1 
          style={{ 
            color: '#ffffff', 
            fontSize: '36px', 
            fontWeight: 'bold', 
            margin: '0 0 16px 0', 
            lineHeight: '1.3' // Added line height to prevent overlapping lines
          }}
        >
          Welcome To Explore Your Dream
          {user.fullName && (
            <span 
              style={{ 
                display: 'block', 
                marginTop: '12px' // Spacing directly above the username
              }}
            >
               {user.fullName}
            </span>
          )}
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px' }}>
          Your TripVault account is active and connected.
        </p>

        {/* User Details Card */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '32px',
            textAlign: 'left',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <span style={{ color: '#64748b', fontSize: '14px', display: 'block', fontWeight: 'bold' }}>
              ACCOUNT NAME
            </span>
            <strong style={{ color: '#e2e8f0', fontSize: '18px' }}>
              {user.fullName || 'Registered User'}
            </strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '14px', display: 'block', fontWeight: 'bold' }}>
              EMAIL ADDRESS
            </span>
            <strong style={{ color: '#e2e8f0', fontSize: '18px' }}>
              {user.email || 'N/A'}
            </strong>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            transition: 'background-color 0.2s',
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}