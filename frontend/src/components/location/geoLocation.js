import React, { useState, useEffect } from 'react';

const GeolocationComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log("User's Location:", position.coords);
        },
        (error) => {
          setError(error.message);
          console.error('Error getting location:', error);
        }
      );
    } else {
      setError('Geolocation is not available');
    }
  }, []);

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
