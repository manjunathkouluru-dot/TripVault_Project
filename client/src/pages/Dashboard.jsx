import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import TripCard from '../components/TripCard';
import TripModal from '../components/TripModal';

export default function Dashboard() {
  const navigate = useNavigate();

  // Lazy initialize user state directly from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    try {
      const parsed = JSON.parse(storedUser);
      const actualUser = parsed.user || parsed;
      return {
        fullName: actualUser.fullName || actualUser.name || actualUser.username || '',
        username: actualUser.username || '',
        email: actualUser.email || '',
        bio: actualUser.bio || '',
      };
    } catch (err) {
      console.error('Failed to parse user details', err);
      return null;
    }
  });

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Bio state
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Get Auth Config with Bearer Token
  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  // Fetch logged-in user profile details (to sync bio & username)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', getAuthConfig());
        const fetchedUser = res.data.user || res.data;
        setUser((prev) => ({
          ...prev,
          username: fetchedUser.username || prev?.username,
          fullName: fetchedUser.fullName || fetchedUser.name || prev?.fullName,
          bio: fetchedUser.bio || '',
        }));
        setBio(fetchedUser.bio || '');
      } catch (err) {
        console.error('Failed to fetch user bio:', err);
      }
    };

    fetchUserData();
  }, [getAuthConfig]);

  // Reusable refetch function for Trips
  const fetchTrips = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trips', getAuthConfig());
      setTrips(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      setError('Could not load trips. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  }, [getAuthConfig]);

  // Handle Authentication Redirect & Initial Data Fetching
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    let isSubscribed = true;

    axios.get('http://localhost:5000/api/trips', getAuthConfig())
      .then((res) => {
        if (isSubscribed) {
          setTrips(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (isSubscribed) {
          console.error('Failed to fetch trips:', err);
          setError('Could not load trips. Please check backend connection.');
        }
      })
      .finally(() => {
        if (isSubscribed) {
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [user, navigate, getAuthConfig]);

  // UPDATE BIO (PUT /api/users/profile)
  const handleUpdateBio = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        'http://localhost:5000/api/users/profile',
        { bio },
        getAuthConfig()
      );
      alert('Bio updated successfully!');
      setUser((prev) => ({ ...prev, bio: res.data.user?.bio || bio }));
      setIsEditingBio(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update bio.');
    }
  };

  // CREATE OR UPDATE TRIP (POST / PUT)
  const handleFormSubmit = async (formData) => {
    try {
      const { imageFile, ...tripPayload } = formData;
      let targetTripId = selectedTrip?._id;

      if (selectedTrip) {
        // Edit Trip
        const res = await axios.put(
          `http://localhost:5000/api/trips/${selectedTrip._id}`,
          tripPayload,
          getAuthConfig()
        );
        targetTripId = res.data._id;
      } else {
        // Create Trip
        const res = await axios.post(
          'http://localhost:5000/api/trips',
          tripPayload,
          getAuthConfig()
        );
        targetTripId = res.data._id;
      }

      // If user selected an image file, upload it directly to Cloudinary
      if (imageFile && targetTripId) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const token = localStorage.getItem('token');
        await axios.post(
          `http://localhost:5000/api/trips/${targetTripId}/upload`,
          uploadData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setIsModalOpen(false);
      setSelectedTrip(null);
      fetchTrips();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving trip.');
    }
  };

  // DELETE TRIP
  const handleDeleteTrip = async (tripId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this trip memory?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/trips/${tripId}`, getAuthConfig());
      fetchTrips();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete trip.');
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedTrip(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={styles.pageContainer}>
      {/* Top Navbar */}
      <header style={styles.navbar}>
        <div style={styles.navBrand}>
          <span style={{ fontSize: '28px' }}>✈️</span>
          <h1 style={styles.brandTitle}>TripVault</h1>
        </div>
        <div style={styles.userControls}>
          <span style={styles.welcomeText}>Welcome, {user?.fullName || 'Traveler'}!</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Log Out</button>
        </div>
      </header>

      {/* Main Container */}
      <main style={styles.mainContent}>
        {/* 📍 PUBLIC PROFILE & EDIT BIO CONTROLS */}
        <div style={styles.profileControlRow}>
          <Link 
  to={`/profile/${user?.username || user?.fullName || user?.name}`} 
  style={styles.publicProfileBtn}
>
  👤 View My Public Profile
</Link>

          <button 
            onClick={() => setIsEditingBio(!isEditingBio)}
            style={styles.editBioToggleBtn}
          >
            ✏️ {isEditingBio ? 'Close Bio Form' : 'Edit Bio'}
          </button>
        </div>

        {/* User Bio Card / Edit Form Modal-box */}
        <div style={styles.bioSection}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '18px' }}>About Me</h3>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '14px' }}>
            {user?.bio || 'No bio added yet. Tell travelers about yourself!'}
          </p>

          {/* Edit Bio Form */}
          {isEditingBio && (
            <form onSubmit={handleUpdateBio} style={styles.bioForm}>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                rows="3" 
                style={styles.textarea}
                placeholder="Tell the world about your travels..."
              />
              <button type="submit" style={styles.saveBioBtn}>
                Save Bio
              </button>
            </form>
          )}
        </div>

        {/* Actions Bar */}
        <div style={styles.actionBar}>
          <div>
            <h2 style={styles.sectionTitle}>Your Trip Collection</h2>
            <p style={styles.subtitle}>Manage, view, and organize your travel memories.</p>
          </div>
          <button onClick={handleOpenCreateModal} style={styles.createBtn}>
            ➕ Add New Trip
          </button>
        </div>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        {/* Loading Indicator */}
        {loading ? (
          <div style={styles.loadingText}>Loading your travel memories...</div>
        ) : trips.length === 0 ? (
          /* Empty State */
          <div style={styles.emptyCard}>
            <span style={{ fontSize: '54px', display: 'block', marginBottom: '12px' }}>🏝️</span>
            <h3 style={{ color: '#ffffff', margin: '0 0 8px 0' }}>No trips added yet</h3>
            <p style={{ color: '#94a3b8', margin: '0 0 20px 0', fontSize: '14px' }}>
              Your vault is empty! Start cataloging your journeys today.
            </p>
            <button onClick={handleOpenCreateModal} style={styles.createBtn}>
              Create Your First Trip
            </button>
          </div>
        ) : (
          /* Trip Cards Grid */
          <div style={styles.grid}>
            {trips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Form Component */}
      <TripModal
        key={selectedTrip ? selectedTrip._id : 'new-trip'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedTrip}
      />
    </div>
  );
}

// Styling matching Royal Navy `#0b1329` theme
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
    gap: '12px',
  },
  brandTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  userControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  welcomeText: {
    color: '#cbd5e1',
    fontWeight: '500',
    fontSize: '15px',
  },
  logoutBtn: {
    backgroundColor: '#f43f5e',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  profileControlRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  publicProfileBtn: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '14px',
    display: 'inline-block',
  },
  editBioToggleBtn: {
    padding: '8px 16px',
    backgroundColor: '#1e3a5f',
    color: '#00f2fe',
    border: '1px solid #00f2fe',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  bioSection: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '28px',
  },
  bioForm: {
    marginTop: '16px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0a1120',
    color: '#ffffff',
    border: '1px solid #1e3a5f',
    borderRadius: '6px',
    marginBottom: '10px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  saveBioBtn: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '28px',
    color: '#ffffff',
  },
  subtitle: {
    margin: '4px 0 0 0',
    color: '#94a3b8',
    fontSize: '14px',
  },
  createBtn: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  emptyCard: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '16px',
    padding: '60px 20px',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '40px auto',
  },
  loadingText: {
    textAlign: 'center',
    color: '#00f2fe',
    fontSize: '18px',
    marginTop: '60px',
  },
  errorBox: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    border: '1px solid #f43f5e',
    color: '#fb7185',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
};