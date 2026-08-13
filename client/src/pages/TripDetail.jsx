import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../api/config';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchTrip = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/trips/${id}`);
      setTrip(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching trip details:', err);
      const msg = getErrorMessage(err);
      setError(`Could not load trip details. ${msg}`);
      toast.error(`Error loading trip: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

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
    if (!file) {
      toast.warning('Please select an image file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await api.post(`/api/trips/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('📸 Photo uploaded successfully to Cloudinary!');
      setTrip(res.data.trip || res.data);
      setFile(null);
      setPreviewUrl('');
    } catch (err) {
      console.error(err);
      toast.error(`Upload failed: ${getErrorMessage(err)}`);
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
      <div className="page-container page-center">
        <Spinner size="large" text="Fetching trip memories..." />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="page-container page-center">
        <ErrorAlert message={error || 'Trip memory not found.'} onRetry={fetchTrip} />
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-4">
          ← Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="page-container trip-detail-page">
      <div className="detail-navigation">
        <Link to="/dashboard" className="btn-back">
          ← Back to Dashboard
        </Link>
      </div>

      <main className="detail-main-content">
        {/* Cover Header */}
        <div className="cover-header-card">
          {trip.coverImage ? (
            <img src={trip.coverImage} alt={trip.title} className="hero-cover-image" />
          ) : (
            <div className="no-cover-placeholder">📷 No Cover Image Uploaded Yet</div>
          )}
          <div className="cover-header-info">
            <h1 className="detail-trip-title">{trip.title}</h1>
            <p className="detail-destination">📍 {trip.destination}</p>
            <div className="detail-meta-row">
              <span className="meta-badge">🗓️ {formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
              <span className="meta-badge">⭐ {trip.rating ? `${trip.rating}/5 Rating` : 'No rating'}</span>
            </div>
          </div>
        </div>

        {/* Description / Notes */}
        {trip.description && (
          <section className="detail-section">
            <h3 className="section-heading">📝 Notes & Memories</h3>
            <p className="detail-description-text">{trip.description}</p>
          </section>
        )}

        {/* Upload New Photo Section */}
        <section className="detail-section upload-box-section">
          <h3 className="section-heading">📸 Add Photo to Trip Gallery</h3>
          <form onSubmit={handleUploadPhoto} className="photo-upload-form">
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                id={`detail-upload-${trip._id}`}
                onChange={handleFileChange}
                className="file-input-hidden"
              />
              <label htmlFor={`detail-upload-${trip._id}`} className="file-input-label">
                {file ? `📄 ${file.name}` : '📁 Choose Image File'}
              </label>
            </div>

            {previewUrl && (
              <div className="upload-preview-box">
                <p className="preview-title">Selected Preview:</p>
                <img src={previewUrl} alt="Preview" className="preview-thumbnail" />
              </div>
            )}

            <button 
              type="submit" 
              disabled={uploading || !file} 
              className="btn btn-emerald"
            >
              {uploading ? '⏳ Uploading to Cloudinary...' : '⬆️ Upload Photo'}
            </button>
          </form>
        </section>

        {/* Photo Gallery Grid */}
        <section className="detail-section">
          <h3 className="section-heading">
            🖼️ Photo Gallery ({trip.photos ? trip.photos.length : 0})
          </h3>
          {trip.photos && trip.photos.length > 0 ? (
            <div className="gallery-photo-grid">
              {trip.photos.map((photoUrl, index) => (
                <div key={index} className="gallery-photo-card">
                  <img src={photoUrl} alt={`Trip photo ${index + 1}`} className="gallery-image" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No photos uploaded to this gallery yet. Use the upload box above to add your photos!</p>
          )}
        </section>
      </main>
    </div>
  );
}
