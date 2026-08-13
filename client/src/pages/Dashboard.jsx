import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../api/config';
import TripCard from '../components/TripCard';
import TripModal from '../components/TripModal';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';

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
  const [bioSaving, setBioSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Reusable refetch function for Trips
  const fetchTrips = useCallback(async () => {
    try {
      const res = await api.get('/api/trips');
      setTrips(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(`Error loading trips: ${msg}`);
    }
  }, []);

  // Initial Fetching & Token Verification
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      api.get('/api/auth/me'),
      api.get('/api/trips'),
    ]).then(([userRes, tripsRes]) => {
      if (!isMounted) return;

      if (userRes.status === 'fulfilled') {
        const fetchedUser = userRes.value.data.user || userRes.value.data;
        setUser({
          fullName: fetchedUser.name || fetchedUser.fullName || fetchedUser.username || 'Traveler',
          username: fetchedUser.username || '',
          email: fetchedUser.email || '',
          bio: fetchedUser.bio || '',
        });
        setBio(fetchedUser.bio || '');
      }

      if (tripsRes.status === 'fulfilled') {
        setTrips(tripsRes.value.data);
        setError('');
      } else {
        console.error('Failed to fetch trips:', tripsRes.reason);
        const msg = getErrorMessage(tripsRes.reason);
        setError(`Could not load trips. ${msg}`);
        toast.error(`Could not load trips: ${msg}`);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Bio Update Handler
  const handleUpdateBio = async (e) => {
    e.preventDefault();
    setBioSaving(true);
    try {
      const res = await api.put('/api/users/profile', { bio });
      const updatedUser = res.data.user || res.data;
      
      const newUserData = {
        ...user,
        bio: updatedUser.bio,
      };
      
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
      setIsEditingBio(false);
      toast.success('🎉 Bio updated successfully!');
    } catch (err) {
      console.error('Failed to update bio:', err);
      toast.error(`Failed to update bio: ${getErrorMessage(err)}`);
    } finally {
      setBioSaving(false);
    }
  };

  // Create or Update Trip Handler
  const handleSaveTrip = async (tripData) => {
    try {
      let savedTrip;
      if (selectedTrip) {
        // Edit existing trip
        const res = await api.put(`/api/trips/${selectedTrip._id}`, tripData);
        savedTrip = res.data;
        toast.success('✨ Trip updated successfully!');
      } else {
        // Create new trip
        const res = await api.post('/api/trips', tripData);
        savedTrip = res.data;
        toast.success('✈️ New trip created successfully!');
      }

      // If user uploaded an image file during modal creation/edit, upload it now
      if (tripData.imageFile && savedTrip._id) {
        const formData = new FormData();
        formData.append('image', tripData.imageFile);
        try {
          await api.post(`/api/trips/${savedTrip._id}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          toast.success('📸 Cover photo uploaded to Cloudinary!');
        } catch (uploadErr) {
          console.error('Photo upload failed:', uploadErr);
          toast.warning('Trip saved, but photo upload failed. You can re-upload from Trip Details.');
        }
      }

      setIsModalOpen(false);
      setSelectedTrip(null);
      fetchTrips();
    } catch (err) {
      console.error('Failed to save trip:', err);
      toast.error(`Failed to save trip: ${getErrorMessage(err)}`);
    }
  };

  // Delete Trip Handler
  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip memory?')) return;

    try {
      await api.delete(`/api/trips/${tripId}`);
      toast.success('🗑️ Trip deleted successfully.');
      setTrips(trips.filter((t) => t._id !== tripId));
    } catch (err) {
      console.error('Failed to delete trip:', err);
      toast.error(`Failed to delete trip: ${getErrorMessage(err)}`);
    }
  };

  return (
    <div className="page-container dashboard-page">
      {/* Traveler Banner */}
      <section className="profile-banner-card">
        <div className="profile-banner-header">
          <div className="profile-avatar">
            <span>{user?.fullName?.charAt(0).toUpperCase() || 'T'}</span>
          </div>
          <div className="profile-meta">
            <h1 className="profile-name">{user?.fullName || 'Traveler'}</h1>
            <p className="profile-username">@{user?.username || 'traveler'}</p>
            {user?.username && (
              <Link to={`/profile/${user.username}`} className="btn-link-public">
                🌐 View Public Profile ↗
              </Link>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="bio-section">
          {isEditingBio ? (
            <form onSubmit={handleUpdateBio} className="bio-form">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your travel philosophy, favorite destinations..."
                rows="3"
                className="bio-input"
              />
              <div className="bio-btn-group">
                <button type="submit" disabled={bioSaving} className="btn btn-primary btn-sm">
                  {bioSaving ? 'Saving...' : 'Save Bio'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditingBio(false)} 
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="bio-display">
              <p className="bio-text">
                {user?.bio || 'No travel bio added yet. Tell the world where you love to explore!'}
              </p>
              <button 
                onClick={() => setIsEditingBio(true)} 
                className="btn btn-outline btn-sm bio-edit-btn"
              >
                ✏️ Edit Bio
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Dashboard Section Header */}
      <div className="dashboard-section-header">
        <div>
          <h2>🗺️ My Travel Memories</h2>
          <p className="section-subtitle">Manage and curate your trip journal.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedTrip(null);
            setIsModalOpen(true);
          }} 
          className="btn btn-primary btn-add-trip"
        >
          ✨ Add New Trip
        </button>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onRetry={fetchTrips} />}

      {/* Loading Skeleton */}
      {loading ? (
        <SkeletonCard count={3} />
      ) : trips.length === 0 ? (
        /* Empty State */
        <EmptyState 
          title="No trips recorded yet"
          message="You haven't added any trips to your Vault. Start documenting your journey now!"
          actionText="Add Your First Trip"
          onAction={() => {
            setSelectedTrip(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        /* Trips Grid */
        <div className="trips-grid">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onEdit={(t) => {
                setSelectedTrip(t);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Trip Modal */}
      <TripModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTrip(null);
        }}
        onSubmit={handleSaveTrip}
        initialData={selectedTrip}
      />
    </div>
  );
}