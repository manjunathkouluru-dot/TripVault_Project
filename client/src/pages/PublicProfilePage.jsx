import { useState, useEffect } from 'react';
import { useParams } from 'react';
import axios from 'axios';

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${username}/profile`)
      .then(res => {
        setProfileData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching public profile:', err);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading profile...</div>;
  }

  if (!profileData) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>User profile not found!</h2>
        <p>Make sure the username is typed correctly.</p>
      </div>
    );
  }

  const { user, trips } = profileData;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Profile Header */}
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>{user.name}</h2>
        <p style={{ color: '#666', fontWeight: 'bold' }}>@{user.username}</p>
        <p style={{ fontStyle: 'italic', marginTop: '10px' }}>{user.bio}</p>
      </div>

      <hr />

      {/* Trips Section */}
      <h3>Travel Memories ({trips ? trips.length : 0})</h3>
      
      {trips && trips.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginTop: '15px' }}>
          {trips.map(trip => (
            <div key={trip._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', background: '#fff' }}>
              {trip.coverImage ? (
                <img 
                  src={trip.coverImage} 
                  alt={trip.title} 
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '160px', background: '#e0e0e0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span>No Photo</span>
                </div>
              )}
              <h4 style={{ marginTop: '10px', marginBottom: '5px' }}>{trip.title}</h4>
              <p style={{ margin: '3px 0', fontSize: '14px' }}>📍 {trip.destination}</p>
              <p style={{ margin: '3px 0', fontSize: '14px' }}>⭐ {trip.rating ? `${trip.rating}/5` : 'No rating'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No public trips shared yet.</p>
      )}
    </div>
  );
}