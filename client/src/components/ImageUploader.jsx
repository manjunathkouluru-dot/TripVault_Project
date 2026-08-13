import { useState } from 'react';
import axios from 'axios';

export default function ImageUploader({ tripId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select an image first!');

    const formData = new FormData();
    formData.append('image', file); // 'image' must match upload.single('image') in backend

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:5000/api/trips/${tripId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Image uploaded!');
      if (onUploadSuccess) {
        onUploadSuccess(response.data.trip);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading to Cloudinary...' : 'Upload Cover Photo'}
      </button>
    </form>
  );
}