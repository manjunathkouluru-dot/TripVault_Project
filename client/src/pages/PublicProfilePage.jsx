import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/config';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/api/users/${username}/profile`)
      .then(res => {
        setProfileData(res.data);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching public profile:', err);
        setError(`User profile @${username} not found!`);
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
      <div className="page-container public-profile-page">
        <SkeletonCard count={3} />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="page-container page-center">
        <ErrorAlert message={error || 'User profile not found!'} />
        <Link to="/dashboard" className="btn btn-primary mt-4">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  const { user, trips } = profileData;
  const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&auto=format&fit=crop';

  return (
    <div className="page-container public-profile-page">
      {/* Profile Header Banner */}
      <section className="profile-banner-card">
        <div className="profile-banner-header">
          <div className="profile-avatar">
            <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
          </div>
          <div className="profile-meta">
            <h1 className="profile-name">{user?.name || 'Traveler'}</h1>
            <p className="profile-username">@{user?.username}</p>
            <p className="public-bio-text">
              {user?.bio || 'Passionate traveler exploring world culture and landscapes.'}
            </p>
          </div>
        </div>
      </section>

      {/* Trips Showcase Header */}
      <div className="dashboard-section-header">
        <div>
          <h2>🌐 Shared Travel Journeys ({trips ? trips.length : 0})</h2>
          <p className="section-subtitle">Public travel memory gallery of @{user?.username}.</p>
        </div>
      </div>

      {trips && trips.length > 0 ? (
        <div className="trips-grid">
          {trips.map((trip) => (
            <div key={trip._id} className="public-trip-card">
              <div className="card-media">
                <img
                  src={trip.coverImage || defaultImage}
                  alt={trip.title}
                  className="card-cover-image"
                />
                <div className="rating-pill">
                  ⭐ {trip.rating ? `${trip.rating}/5` : 'N/A'}
                </div>
              </div>

              <div className="card-body">
                <h3 className="card-trip-title">{trip.title}</h3>
                <p className="card-destination">📍 {trip.destination}</p>
                {(trip.startDate || trip.endDate) && (
                  <p className="card-date-badge">
                    🗓️ {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                  </p>
                )}
                {trip.description && (
                  <p className="card-description-text">{trip.description}</p>
                )}

                {trip.photos && trip.photos.length > 0 && (
                  <div className="mini-photo-gallery">
                    <p className="mini-gallery-title">Photos ({trip.photos.length})</p>
                    <div className="mini-thumbs-row">
                      {trip.photos.slice(0, 4).map((photo, i) => (
                        <img key={i} src={photo} alt="Thumbnail" className="mini-thumbnail" />
                      ))}
                      {trip.photos.length > 4 && (
                        <span className="more-count">+{trip.photos.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No public trips yet"
          message={`@${user?.username} hasn't published any trip memories to their profile yet.`}
          actionText=""
        />
      )}
    </div>
  );
}