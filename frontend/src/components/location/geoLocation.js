import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is included

const GeolocationComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [liveTracking, setLiveTracking] = useState(false);

  const userId = localStorage.getItem('userId'); // Assume userId is stored in local storage

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

  // Handle live location tracking
  useEffect(() => {
    let watchId;
    if (liveTracking) {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            sendLocationToServer(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            setError(error.message);
            console.error('Error watching location:', error);
          }
        );
      }
    }

    // Cleanup
    return () => {
      if (navigator.geolocation && watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [liveTracking]);

  // Send location to server
  const sendLocationToServer = async (latitude, longitude) => {
    if (!userId) {
      console.error('User ID not available');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/locationUpdate`,
        { userId, latitude, longitude },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Location sent to server:', response.data);
    } catch (error) {
      console.error('Error sending location to server:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3>Geolocation Tracker</h3>
        </div>
        <div className="card-body">
          {error ? (
            <div className="alert alert-danger" role="alert">
              Error: {error}
            </div>
          ) : (
            <div className="text-center">
              <h5 className="card-title">Current Location:</h5>
              <p className="card-text">
                Latitude: {location.latitude || 'Fetching...'}, Longitude: {location.longitude || 'Fetching...'}
              </p>
              <button
                className="btn btn-success mt-3"
                onClick={() => window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_blank')}
                disabled={!location.latitude || !location.longitude}
              >
                View on Map
              </button>
            </div>
          )}

          <div className="form-check form-switch mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="liveLocationSwitch"
              checked={liveTracking}
              onChange={() => setLiveTracking(!liveTracking)}
            />
            <label className="form-check-label" htmlFor="liveLocationSwitch">
              {liveTracking ? 'Disable Live Location' : 'Enable Live Location'}
            </label>
          </div>
        </div>
        <div className="card-footer text-muted text-center">
          {liveTracking ? 'Live location tracking is enabled.' : 'Live location tracking is disabled.'}
        </div>
      </div>
    </div>
  );
};

export default GeolocationComponent;
