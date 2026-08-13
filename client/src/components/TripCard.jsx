import { Link } from 'react-router-dom';

export default function TripCard({ trip, onEdit, onDelete }) {
  // Default fallback image if trip.coverImage is missing or empty
  const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&auto=format&fit=crop';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderStars = (rating) => {
    if (!rating) return 'No rating';
    return '⭐'.repeat(rating);
  };

  return (
    <div style={styles.card}>
      {/* 1. Cover Image Header with Fallback */}
      <div style={styles.imageContainer}>
        <img 
          src={trip.coverImage || defaultImage} 
          alt={trip.title || 'Trip Cover'} 
          style={styles.coverImage}
        />
      </div>

      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.title}>{trip.title}</h3>
            <p style={styles.destination}>📍 {trip.destination}</p>
          </div>
          <span style={styles.rating}>{renderStars(trip.rating)}</span>
        </div>

        <div style={styles.dateBadge}>
          🗓️ {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
        </div>

        {trip.description && (
          <p style={styles.description}>{trip.description}</p>
        )}

        {/* 2. Photo Gallery Grid (renders if trip.photos has items) */}
        {trip.photos && trip.photos.length > 0 && (
          <div style={styles.galleryContainer}>
            <p style={styles.galleryTitle}>📸 Photo Gallery ({trip.photos.length})</p>
            <div style={styles.photoGrid}>
              {trip.photos.slice(0, 4).map((photoUrl, index) => (
                <img 
                  key={index} 
                  src={photoUrl} 
                  alt={`Trip photo ${index + 1}`} 
                  style={styles.gridPhoto} 
                />
              ))}
            </div>
          </div>
        )}

        <div style={styles.actionRow}>
          <Link to={`/trips/${trip._id}`} style={styles.viewBtn}>
            🔍 Details & Photos
          </Link>
          <button onClick={() => onEdit(trip)} style={styles.editBtn}>
            ✏️ Edit
          </button>
          <button onClick={() => onDelete(trip._id)} style={styles.deleteBtn}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '12px',
    overflow: 'hidden', // Ensures image fits neatly inside card corners
    display: 'flex',
    flexDirection: 'column',
    justify: 'space-between',
    boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.4)',
    transition: 'transform 0.2s ease',
  },
  imageContainer: {
    width: '100%',
    height: '180px',
    backgroundColor: '#0a1120',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  title: {
    margin: '0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  destination: {
    margin: '4px 0 0 0',
    color: '#00f2fe',
    fontSize: '14px',
    fontWeight: '600',
  },
  rating: {
    fontSize: '14px',
  },
  dateBadge: {
    backgroundColor: '#0a1120',
    color: '#94a3b8',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '14px',
    border: '1px solid #1e293b',
  },
  description: {
    color: '#cbd5e1',
    fontSize: '14px',
    lineHeight: '1.4',
    marginBottom: '16px',
  },
  galleryContainer: {
    marginBottom: '16px',
  },
  galleryTitle: {
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '8px',
  },
  gridPhoto: {
    width: '100%',
    height: '60px',
    borderRadius: '6px',
    objectFit: 'cover',
    border: '1px solid #1e3a5f',
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    flexWrap: 'wrap',
  },
  viewBtn: {
    flex: '1 1 100%',
    backgroundColor: '#007bff',
    color: '#ffffff',
    textDecoration: 'none',
    textAlign: 'center',
    padding: '8px 12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '13px',
    display: 'block',
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    color: '#00f2fe',
    border: '1px solid #00f2fe',
    padding: '10px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    color: '#fb7185',
    border: '1px solid #f43f5e',
    padding: '10px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
};