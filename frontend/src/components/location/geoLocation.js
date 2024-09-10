import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GeolocationComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          sendLocationToServer(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError(error.message);
          console.error('Error getting location:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Send location to server
  const sendLocationToServer = async (latitude, longitude) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/location/update`,
        { latitude, longitude },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Location sent to server:', response.data);
    } catch (error) {
      console.error('Error sending location to server:', error);
    }
  };

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
    </div>
  );
};

export default GeolocationComponent;
