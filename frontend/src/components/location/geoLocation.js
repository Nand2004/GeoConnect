import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is included
import { Button, Spinner } from 'react-bootstrap';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GeolocationComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false); // Track the button update state
  const userId = localStorage.getItem('userId'); // Assume the user's ID is stored in local storage

  const mapStyles = {        
    height: "400px",
    width: "100%"
  };
  
  const defaultCenter = {
    lat: location.latitude || 0, 
    lng: location.longitude || 0
  };

  // Function to get the user's location and send it to the server
  const fetchLocationAndSend = (showUpdating = false) => {
    if (navigator.geolocation) {
      if (showUpdating) setUpdating(true); // Show spinner for manual update

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          sendLocationToServer(position.coords.latitude, position.coords.longitude);
          if (showUpdating) setUpdating(false); // Hide spinner after manual update
        },
        (error) => {
          setError(error.message);
          console.error('Error getting location:', error);
          if (showUpdating) setUpdating(false); // Hide spinner if error occurs
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Automatically fetch and update location every 2 minutes
  useEffect(() => {
    // Initial fetch when component mounts
    fetchLocationAndSend();

    // Set an interval to update location every 2 minutes (120,000 milliseconds)
    const locationInterval = setInterval(() => {
      fetchLocationAndSend();
    }, 120000); // 2 minutes

    // Clear the interval when the component unmounts
    return () => clearInterval(locationInterval);
  }, []);

  // Send location to the server
  const sendLocationToServer = async (latitude, longitude) => {
    if (!userId) {
      console.error('User ID not available');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/locationUpdate`,
        { userId, latitude, longitude },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Location sent to server:', response.data);
    } catch (error) {
      console.error('Error sending location to server:', error);
    }
  };

  return (
    <div className="container mt-5" style={{ paddingTop: '25px' }}>
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

              {/* Display the Google Map with a marker */}
              <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={15}
                  center={defaultCenter}
                >
                  {location.latitude && location.longitude && (
                    <Marker position={{ lat: location.latitude, lng: location.longitude }} />
                  )}
                </GoogleMap>
              </LoadScript>

              {/* Google Maps External Link */}
              <Button
                className="btn btn-success mt-3"
                onClick={() => window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_blank')}
                disabled={!location.latitude || !location.longitude}
              >
                View on Map
              </Button>

              {/* Button to Manually Update Current Location */}
              <Button
                onClick={() => fetchLocationAndSend(true)} // Pass true to show updating state
                variant="primary"
                disabled={updating}
                style={{ marginTop: '10px', marginLeft: '10px' }}
              >
                {updating ? <Spinner animation="border" size="sm" /> : 'Update Current Location'}
              </Button>
            </div>
          )}
        </div>
        <div className="card-footer text-muted text-center">
          Your location is being updated every 2 minutes.
        </div>
      </div>
    </div>
  );
};

export default GeolocationComponent;
