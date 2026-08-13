import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const fetchTrip = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/trips/${id}`, getAuthConfig());
      setTrip(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching trip details:', err);
      setError('Could not load trip details. You might not be authorized.');
    } finally {
      setLoading(false);
    }
  }, [id, getAuthConfig]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select an image file first!');

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/trips/${id}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Photo uploaded successfully to Cloudinary!');
      setTrip(res.data.trip);
      setFile(null);
      setPreviewUrl('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.centerBox}>Loading trip details...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.centerBox}>
          <h2>⚠️ {error || 'Trip not found'}</h2>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.navbar}>
        <Link to="/dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1 style={styles.navTitle}>TripVault Detail</h1>
        <div></div>
      </header>

      <main style={styles.mainContent}>
        {/* Cover Header */}
        <div style={styles.coverHeader}>
          {trip.coverImage ? (
            <img src={trip.coverImage} alt={trip.title} style={styles.heroImage} />
          ) : (
            <div style={styles.noCoverBox}>No Cover Image Uploaded</div>
          )}
          <div style={styles.headerInfo}>
            <h1 style={styles.tripTitle}>{trip.title}</h1>
            <p style={styles.destination}>📍 {trip.destination}</p>
            <div style={styles.metaRow}>
              <span>🗓️ {formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
              <span>⭐ {trip.rating ? `${trip.rating}/5` : 'No rating'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {trip.description && (
          <section style={styles.section}>
            <h3>Notes & Memories</h3>
            <p style={styles.description}>{trip.description}</p>
          </section>
        )}

        {/* Upload New Photo Section */}
        <section style={styles.uploadSection}>
          <h3>Add Photo to Trip</h3>
          <form onSubmit={handleUploadPhoto} style={styles.uploadForm}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            {previewUrl && (
              <div style={styles.previewBox}>
                <p style={{ fontSize: '12px', margin: '0 0 6px 0', color: '#94a3b8' }}>Preview:</p>
                <img src={previewUrl} alt="Preview" style={styles.previewImage} />
              </div>
            )}
            <button type="submit" disabled={uploading || !file} style={styles.uploadBtn}>
              {uploading ? 'Uploading to Cloudinary...' : '📸 Upload Photo'}
            </button>
          </form>
        </section>

        {/* Photo Gallery Grid */}
        <section style={styles.section}>
          <h3>Photo Gallery ({trip.photos ? trip.photos.length : 0})</h3>
          {trip.photos && trip.photos.length > 0 ? (
            <div style={styles.photoGrid}>
              {trip.photos.map((photoUrl, index) => (
                <div key={index} style={styles.photoCard}>
                  <img src={photoUrl} alt={`Trip photo ${index + 1}`} style={styles.gridImage} />
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8' }}>No photos uploaded yet for this trip.</p>
          )}
        </section>
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
  backLink: {
    color: '#00f2fe',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  navTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#ffffff',
  },
  mainContent: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  coverHeader: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '28px',
  },
  heroImage: {
    width: '100%',
    height: '320px',
    objectFit: 'cover',
  },
  noCoverBox: {
    width: '100%',
    height: '180px',
    backgroundColor: '#0a1120',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
  },
  headerInfo: {
    padding: '24px',
  },
  tripTitle: {
    margin: '0 0 8px 0',
    fontSize: '28px',
  },
  destination: {
    margin: '0 0 12px 0',
    color: '#00f2fe',
    fontSize: '16px',
    fontWeight: '600',
  },
  metaRow: {
    display: 'flex',
    gap: '20px',
    color: '#94a3b8',
    fontSize: '14px',
  },
  section: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '28px',
  },
  description: {
    color: '#cbd5e1',
    lineHeight: '1.6',
    whiteSpace: 'pre-line',
  },
  uploadSection: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '28px',
  },
  uploadForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '400px',
    marginTop: '12px',
  },
  fileInput: {
    backgroundColor: '#0a1120',
    color: '#ffffff',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #1e3a5f',
  },
  previewBox: {
    marginTop: '8px',
  },
  previewImage: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #00f2fe',
  },
  uploadBtn: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  },
  photoCard: {
    borderRadius: '10px',
    overflow: 'hidden',
    height: '180px',
    border: '1px solid #1e3a5f',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  centerBox: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#ffffff',
  },
  backBtn: {
    marginTop: '16px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
