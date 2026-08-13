import { useState } from 'react';

export default function TripModal({ isOpen, onClose, onSubmit, initialData }) {
  // Use lazy state initialization to directly set initial values on mount
  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    startDate: initialData?.startDate ? initialData.startDate.split('T')[0] : '',
    endDate: initialData?.endDate ? initialData.endDate.split('T')[0] : '',
    description: initialData?.description || '',
    rating: initialData?.rating || 5,
  }));

  // Sync state when initialData or isOpen changes using React's render pattern
  const [prevData, setPrevData] = useState({ initialData, isOpen });
  if (prevData.initialData !== initialData || prevData.isOpen !== isOpen) {
    setPrevData({ initialData, isOpen });
    setFormData({
      title: initialData?.title || '',
      destination: initialData?.destination || '',
      startDate: initialData?.startDate ? initialData.startDate.split('T')[0] : '',
      endDate: initialData?.endDate ? initialData.endDate.split('T')[0] : '',
      description: initialData?.description || '',
      rating: initialData?.rating || 5,
    });
  }

  const [locationError, setLocationError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  if (!isOpen) return null;

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.coverImage || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocationError('');
    setIsValidating(true);

    try {
      // Check destination against OpenStreetMap API
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.destination
        )}`
      );
      const data = await res.json();

      if (!data || data.length === 0) {
        setLocationError('⚠️ Invalid location! This place is not marked on the map.');
        setIsValidating(false);
        return; // Prevent form submission
      }

      // Valid location -> proceed to submission including imageFile
      onSubmit({ ...formData, imageFile });
    } catch {
      // Fallback if network issue
      onSubmit({ ...formData, imageFile });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {initialData ? '✏️ Edit Trip' : '✈️ Add New Trip'}
          </h2>
          <button type="button" onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Trip Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Summer in Bali"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Destination *</label>
            <input
              type="text"
              required
              placeholder="e.g., Denpasar, Indonesia"
              value={formData.destination}
              onChange={(e) => {
                setLocationError('');
                setFormData((prev) => ({ ...prev, destination: e.target.value }));
              }}
              style={{
                ...styles.input,
                borderColor: locationError ? '#f43f5e' : '#1e3a5f',
              }}
            />
            {locationError && (
              <span style={styles.errorText}>{locationError}</span>
            )}
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
                style={styles.input}
              />
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Rating (1 - 5)</label>
            <select
              value={formData.rating}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))
              }
              style={styles.input}
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
              <option value={4}>⭐⭐⭐⭐ (4/5)</option>
              <option value={3}>⭐⭐⭐ (3/5)</option>
              <option value={2}>⭐⭐ (2/5)</option>
              <option value={1}>⭐ (1/5)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Cover Photo Upload (Cloudinary)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.input}
            />
            {imagePreview && (
              <div style={{ marginTop: '6px' }}>
                <img
                  src={imagePreview}
                  alt="Selected Preview"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #00f2fe' }}
                />
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description / Memories</label>
            <textarea
              rows="3"
              placeholder="Write down notes, itinerary highlights, or favorite memories..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isValidating}
              style={{
                ...styles.submitBtn,
                opacity: isValidating ? 0.7 : 1,
                cursor: isValidating ? 'not-allowed' : 'pointer',
              }}
            >
              {isValidating
                ? 'Verifying Location...'
                : initialData
                ? 'Save Changes'
                : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 19, 41, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalCard: {
    backgroundColor: '#152238',
    border: '1px solid #1e3a5f',
    borderRadius: '16px',
    padding: '28px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 30px -10px rgba(0, 242, 254, 0.15)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    color: '#ffffff',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '20px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  row: {
    display: 'flex',
    gap: '12px',
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
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #1e3a5f',
    backgroundColor: '#0a1120',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  errorText: {
    color: '#fb7185',
    fontSize: '12px',
    marginTop: '2px',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid #1e3a5f',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};