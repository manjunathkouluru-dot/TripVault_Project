import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/users/${username}/profile`)
      .then(res => {
        setProfileData(res.data);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching public profile:', err);
        setError('User profile not found!');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.centerText}>Loading profile...</div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.emptyCard}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🔍</span>
          <h2>User Profile Not Found</h2>
          <p style={{ color: '#94a3b8' }}>Check the username in the URL or return to home.</p>
          <Link to="/" style={styles.homeBtn}>Go to Home</Link>
        </div>
      </div>
    );
  }

  const { user, trips } = profileData;
  const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&auto=format&fit=crop';

  return (
    <div style={styles.pageContainer}>
      <header style={styles.navbar}>
        <div style={styles.navBrand}>
          <span style={{ fontSize: '24px' }}>✈️</span>
          <h1 style={styles.brandTitle}>TripVault</h1>
        </div>
        <Link to="/login" style={styles.loginLink}>Sign In</Link>
      </header>

      <main style={styles.mainContent}>
        {/* Profile Banner / Card */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarCircle}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={styles.profileMeta}>
            <h2 style={styles.userName}>{user.name}</h2>
            <p style={styles.userHandle}>@{user.username}</p>
            <p style={styles.userBio}>{user.bio || 'Passionate traveler exploring the world.'}</p>
          </div>
        </div>

        {/* Trips Showcase Section */}
        <div style={styles.tripsHeader}>
          <h3>Shared Travel Journeys ({trips ? trips.length : 0})</h3>
        </div>

        {trips && trips.length > 0 ? (
          <div style={styles.grid}>
            {trips.map(trip => (
              <div key={trip._id} style={styles.card}>
                <div style={styles.cardMedia}>
                  <img
                    src={trip.coverImage || defaultImage}
                    alt={trip.title}
                    style={styles.coverImg}
                  />
                  <div style={styles.ratingBadge}>
                    ⭐ {trip.rating ? `${trip.rating}/5` : 'N/A'}
                  </div>
                </div>
                <div style={styles.cardBody}>
                  <h4 style={styles.tripTitle}>{trip.title}</h4>
                  <p style={styles.destination}>📍 {trip.destination}</p>
                  {(trip.startDate || trip.endDate) && (
                    <p style={styles.dates}>
                      🗓️ {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                    </p>
                  )}
                  {trip.description && (
                    <p style={styles.desc}>{trip.description}</p>
                  )}
                  {trip.photos && trip.photos.length > 0 && (
                    <div style={styles.miniGallery}>
                      {trip.photos.slice(0, 3).map((photo, i) => (
                        <img key={i} src={photo} alt="Thumbnail" style={styles.miniThumb} />
                      ))}
                      {trip.photos.length > 3 && (
                        <span style={styles.moreCount}>+{trip.photos.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyCard}>
            <p style={{ color: '#94a3b8' }}>This user hasn't posted any public trip memories yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#0b1329',
    minHeight: '100vh',
    color: '#ffffff',
  },
  navbar: {
    backgroundColor: '#152238',
    borderBottom: '1px solid #1e3a5f',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  loginLink: {
    color: '#00f2fe',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '14px',
    border: '1px solid #00f2fe',
    padding: '6px 14px',
    borderRadius: '6px',
  },
  mainContent: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  profileHeader: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
  },
  avatarCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#1e3a5f',
    color: '#00f2fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    border: '2px solid #00f2fe',
    flexShrink: 0,
  },
  profileMeta: {
    flexGrow: 1,
  },
  userName: {
    margin: '0 0 4px 0',
    fontSize: '26px',
    color: '#ffffff',
  },
  userHandle: {
    margin: '0 0 10px 0',
    color: '#00f2fe',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  userBio: {
    margin: 0,
    color: '#cbd5e1',
    fontStyle: 'italic',
    fontSize: '14px',
  },
  tripsHeader: {
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '14px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    position: 'relative',
    height: '180px',
    backgroundColor: '#0a1120',
  },
  coverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(11, 19, 41, 0.85)',
    color: '#fbbf24',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  cardBody: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  tripTitle: {
    margin: '0 0 6px 0',
    fontSize: '18px',
    color: '#ffffff',
  },
  destination: {
    margin: '0 0 6px 0',
    color: '#00f2fe',
    fontSize: '14px',
    fontWeight: '600',
  },
  dates: {
    margin: '0 0 10px 0',
    color: '#94a3b8',
    fontSize: '12px',
  },
  desc: {
    color: '#cbd5e1',
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '12px',
  },
  miniGallery: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    marginTop: 'auto',
  },
  miniThumb: {
    width: '40px',
    height: '40px',
    borderRadius: '4px',
    objectFit: 'cover',
    border: '1px solid #1e3a5f',
  },
  moreCount: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  centerText: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#00f2fe',
    fontSize: '18px',
  },
  emptyCard: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '16px',
    padding: '40px 20px',
    textAlign: 'center',
    maxWidth: '450px',
    margin: '40px auto',
  },
  homeBtn: {
    display: 'inline-block',
    marginTop: '16px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};