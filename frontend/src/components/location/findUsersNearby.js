import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Users, Loader2, AlertCircle, Mail, Navigation, Search } from 'lucide-react';
import ChatButton from '../chat/chatButton';
import getUserInfo from "../../utilities/decodeJwt";



const FindUsersNearby = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchDistance, setSearchDistance] = useState(500);
  const [currentUser, setCurrentUser] = useState(null);

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    setMessage('');

    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLocation({ latitude: coords.latitude, longitude: coords.longitude });
          findUsersNearby(coords.latitude, coords.longitude);
          console.log("The User's location is : ", location);
        },
        () => {
          setLoading(false);
          setError('Error getting your location. Please enable location access.');
        }
      )
      : setError('Geolocation is not supported by this browser.');
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setCurrentUser(userInfo);
    }
  }, []);

  useEffect(() => {
    getUserLocation();  // Get the location immediately when the component mounts

    const interval = setInterval(() => {
      getUserLocation();  // Get the location every 2 minutes
    }, 120000); 

    return () => clearInterval(interval);
  }, []);

  const findUsersNearby = async (latitude, longitude) => {
    try {
      const { data } = await axios.get('http://localhost:8081/user/locationGetNearby', {
        params: { latitude, longitude, distance: searchDistance },
      });
      setNearbyUsers(data);
      if (data.length === 0) setMessage('No users found nearby.');
    } catch {
      setError('Error finding nearby users.');
    }
    setLoading(false);
  };

  return (
    <Container className="py-5" style={styles.container}>
      <div className="text-center mb-5">
        <h2 style={styles.title}>Find Users Nearby</h2>

        <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={searchDistance}
            onChange={(e) => setSearchDistance(Number(e.target.value))}
            className="form-range"
            style={{ width: '200px' }}
          />
          <span className="text-white">
            Search radius: {searchDistance}m
          </span>

          <Button
            onClick={getUserLocation}
            style={styles.button}
            disabled={loading}
            className="d-flex align-items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Search size={20} />
                Find Users
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="danger" style={styles.alert} className="d-flex align-items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </Alert>
        )}

        {message && (
          <Alert variant="info" style={styles.alert} className="d-flex align-items-center gap-2">
            <Users size={20} />
            {message}
          </Alert>
        )}
      </div>

      <Row>
        {nearbyUsers.map((user, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card
              style={styles.card}
              className="h-100"
              onClick={() => setSelectedUser(user)}
            >
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title className="text-white mb-2">{user.username}</Card.Title>
                    <div className="d-flex align-items-center gap-2 text-gray-300 mb-2">
                      <Mail size={16} />
                      {user.email}
                    </div>
                </div>

                  <div className="d-flex align-items-center gap-1 text-success">
                    <Navigation size={16} />
                    <span className="small">
                      {Math.round(
                        calculateDistance(
                          location.latitude,
                          location.longitude,
                          user.location.coordinates[1],
                          user.location.coordinates[0]
                        )
                      )}m
                    </span>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-3 text-muted small">
                  <div className="d-flex align-items-center gap-1">
                    <MapPin size={14} />
                    {user.location.coordinates[1].toFixed(4)}°N
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <MapPin size={14} />
                    {user.location.coordinates[0].toFixed(4)}°E
                  </div>
                </div>

                <div className="mt-auto pt-3">
                  <ChatButton 
                    targetUser={user}
                    currentUserId={currentUser?.id}
                    onSuccess={(message) => {
                      setMessage(message);
                      setTimeout(() => setMessage(''), 3000);
                    }}
                    onError={(error) => {
                      setError(error);
                      setTimeout(() => setError(''), 3000);
                    }}
                  />
                </div>
                
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {location.latitude && location.longitude && (
        <div className="mt-4 rounded overflow-hidden" style={{ height: '400px' }}>
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              center={{ lat: location.latitude, lng: location.longitude }}
              zoom={16}
              mapContainerStyle={{ height: '100%', width: '100%' }}
              options={{
                styles: [
                  {
                    featureType: 'all',
                    elementType: 'geometry',
                    stylers: [{ color: '#242f3e' }]
                  },
                  {
                    featureType: 'all',
                    elementType: 'labels.text.stroke',
                    stylers: [{ color: '#242f3e' }]
                  },
                  {
                    featureType: 'all',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#746855' }]
                  },
                  {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#17263c' }]
                  }
                ]
              }}
            >
              <Marker
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={{
                  path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                  fillColor: '#6366f1',
                  fillOpacity: 0.6,
                  strokeWeight: 0,
                  scale: 0.5
                }}
              />

              {nearbyUsers.map((user, index) => (
                <Marker
                  key={index}
                  position={{ lat: user.location.coordinates[1], lng: user.location.coordinates[0] }}
                  icon={{
                    path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                    fillColor: '#ec4899',
                    fillOpacity: 0.6,
                    strokeWeight: 0,
                    scale: 0.3
                  }}
                  onClick={() => setSelectedUser(user)}
                />
              ))}

              {selectedUser && (
                <InfoWindow
                  position={{
                    lat: selectedUser.location.coordinates[1],
                    lng: selectedUser.location.coordinates[0]
                  }}
                  onCloseClick={() => setSelectedUser(null)}
                >
                  <div className="p-2">
                    <h5 className="mb-2">{selectedUser.username}</h5>
                    <div className="small text-muted">
                      <p className="mb-1 d-flex align-items-center gap-1">
                        <Mail size={14} />
                        {selectedUser.email}
                      </p>
                      <p className="mb-0 d-flex align-items-center gap-1">
                        <Navigation size={14} />
                        {Math.round(
                          calculateDistance(
                            location.latitude,
                            location.longitude,
                            selectedUser.location.coordinates[1],
                            selectedUser.location.coordinates[0]
                          )
                        )}m away
                      </p>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      )}
    </Container>
  );
};

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #0a0a19 0%, #1a1a4a 50%, #0a0a19 100%)',
    borderRadius: '15px',
    minHeight: '100vh',
    padding: '30px'
  },
  title: {
    color: '#FFD700',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  },
  button: {
    background: 'linear-gradient(to right, #ff6b6b, #ff8e8e)',
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 15px rgba(255,107,107,0.2)'
  },
  alert: {
    borderRadius: '10px',
    marginBottom: '20px'
  },
  card: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '15px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
    }
  }
};

export default FindUsersNearby;