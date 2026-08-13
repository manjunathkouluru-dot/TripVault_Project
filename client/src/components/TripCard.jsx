

export default function TripCard({ trip, onEdit, onDelete }) {
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

      <div style={styles.actionRow}>
        <button onClick={() => onEdit(trip)} style={styles.editBtn}>
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(trip._id)} style={styles.deleteBtn}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.4)',
    transition: 'transform 0.2s ease',
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
    marginBottom: '20px',
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto',
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