import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaUsers, FaSpinner, FaExclamationCircle, FaEnvelope, FaCompass, FaSearch } from 'react-icons/fa';
import ChatButton from '../chat/chatButton/chatButton';
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
  const [isHovered, setIsHovered] = useState(null);

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

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

  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    setMessage('');

    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setLocation({ latitude: coords.latitude, longitude: coords.longitude });
            findUsersNearby(coords.latitude, coords.longitude);
          },
          () => {
            setLoading(false);
            setError('Error getting your location. Please enable location access.');
          }
        )
      : setError('Geolocation is not supported by this browser.');
  };

  const findUsersNearby = async (latitude, longitude) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/locationGetNearby`, {
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
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Find Users Nearby</h2>

        <div style={styles.controls}>
          <div style={styles.rangeContainer}>
            <input
              type="range"
              min="100"
              max="1000"
              step="100"
              value={searchDistance}
              onChange={(e) => setSearchDistance(Number(e.target.value))}
              style={styles.rangeInput}
            />
            <span style={styles.rangeValue}>
              Search radius: {searchDistance}m
            </span>
          </div>

          <button
            onClick={getUserLocation}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner style={styles.spinningIcon} />
            ) : (
              <>
                <FaSearch style={styles.buttonIcon} />
                Find Users
              </>
            )}
          </button>
        </div>

        {error && (
          <div style={styles.alert}>
            <FaExclamationCircle style={styles.alertIcon} />
            {error}
          </div>
        )}

        {message && (
          <div style={styles.message}>
            <FaUsers style={styles.messageIcon} />
            {message}
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.userGrid}>
          {nearbyUsers.map((user, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                ...(isHovered === index ? styles.cardHovered : {}),
              }}
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(null)}
              onClick={() => setSelectedUser(user)}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{user.username}</h3>
                <div style={styles.distance}>
                  <FaCompass style={styles.distanceIcon} />
                  <span>
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

              <div style={styles.cardContent}>
                <div style={styles.emailContainer}>
                  <FaEnvelope style={styles.emailIcon} />
                  {user.email}
                </div>

                <div style={styles.coordinates}>
                  <div>
                    <FaMapMarkerAlt style={styles.coordIcon} />
                    {user.location.coordinates[1].toFixed(4)}°N
                  </div>
                  <div>
                    <FaMapMarkerAlt style={styles.coordIcon} />
                    {user.location.coordinates[0].toFixed(4)}°E
                  </div>
                </div>

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
            </div>
          ))}
        </div>

        {location.latitude && location.longitude && (
          <div style={styles.mapContainer}>
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap
                center={{ lat: location.latitude, lng: location.longitude }}
                zoom={16}
                mapContainerStyle={styles.map}
                options={{
                  styles: mapStyles
                }}
              >
                <Marker
                  position={{ lat: location.latitude, lng: location.longitude }}
                  icon={{
                    path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                    fillColor: '#4F46E5',
                    fillOpacity: 0.6,
                    strokeWeight: 0,
                    scale: 0.5
                  }}
                />

                {nearbyUsers.map((user, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: user.location.coordinates[1],
                      lng: user.location.coordinates[0]
                    }}
                    icon={{
                      path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                      fillColor: '#EC4899',
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
                    <div style={styles.infoWindow}>
                      <h3 style={styles.infoTitle}>{selectedUser.username}</h3>
                      <div style={styles.infoContent}>
                        <p style={styles.infoText}>
                          <FaEnvelope style={styles.infoIcon} />
                          {selectedUser.email}
                        </p>
                        <p style={styles.infoText}>
                          <FaCompass style={styles.infoIcon} />
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
      </div>
    </div>
  );
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
    minHeight: '100vh',
    padding: '2rem',
    color: '#fff',
    paddingTop: "70px",
    paddingBottom: "50px",
    overflow: 'hidden',


  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #4F46E5, #EC4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1.5rem',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '1.5rem',
  },
  rangeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  rangeInput: {
    width: '200px',
    accentColor: '#4F46E5',
  },
  rangeValue: {
    color: '#94A3B8',
    fontSize: '0.9rem',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(45deg, #4F46E5, #EC4899)',
    border: 'none',
    borderRadius: '9999px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.1)',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  buttonIcon: {
    fontSize: '1.2rem',
  },
  spinningIcon: {
    fontSize: '1.2rem',
    animation: 'spin 1s linear infinite',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    maxHeight: 'calc(100vh - 150px)', /* Adjust this based on header height */
  overflowY: 'auto', /* Enable scroll for content */
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  cardHovered: {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
  },
  distance: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#10B981',
    fontSize: '0.9rem',
  },
  distanceIcon: {
    fontSize: '1rem',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  emailContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#94A3B8',
    fontSize: '0.9rem',
  },
  coordinates: {
    display: 'flex',
    gap: '1rem',
    color: '#94A3B8',
    fontSize: '0.8rem',
  },
  coordIcon: {
    marginRight: '0.25rem',
  },
  chatButton: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    background: 'linear-gradient(45deg, #4F46E5, #EC4899)',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#fff',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  mapContainer: {
    borderRadius: '1rem',
    overflow: 'hidden',
    height: '100%',
    minHeight: '500px',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoWindow: {
    padding: '1rem',
    maxWidth: '200px',
  },
  infoTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#1F2937',
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  infoText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: 0,
    color: '#4B5563',
    fontSize:'0.9rem',
  },
  infoIcon: {
    fontSize: '0.9rem',
    color: '#6B7280',
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '0.5rem',
    color: '#EF4444',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '0.5rem',
    color: '#3B82F6',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  alertIcon: {
    fontSize: '1.1rem',
  },
  messageIcon: {
    fontSize: '1.1rem',
  },
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
};

const mapStyles = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#242f3e' }]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }]
  }
];

export default FindUsersNearby;