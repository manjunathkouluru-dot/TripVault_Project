import { useState } from 'react';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../api/config';

export default function ImageUploader({ tripId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning('Please select an image file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      
      const response = await api.post(
        `/api/trips/${tripId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      toast.success('📸 Photo uploaded successfully!');
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(response.data.trip || response.data);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Upload failed: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="image-uploader-form">
      <div className="file-input-wrapper">
        <input 
          type="file" 
          accept="image/*" 
          id={`file-input-${tripId}`}
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input-hidden" 
        />
        <label htmlFor={`file-input-${tripId}`} className="file-input-label">
          {file ? `📄 ${file.name}` : '📁 Choose Image File'}
        </label>
      </div>
      <button type="submit" disabled={loading || !file} className="btn btn-primary btn-sm">
        {loading ? '⏳ Uploading...' : '⬆️ Upload Photo'}
      </button>
    </form>
  );
}