import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const FindUsersNearby = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

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
      const { data } = await axios.get('http://localhost:8081/user/locationGetNearby', {
        params: { latitude, longitude, distance: 500 },
      });
      setNearbyUsers(data);
      if (data.length === 0) setMessage('No users found nearby.');
    } catch {
      setError('Error finding nearby users.');
    }
    setLoading(false);
  };

  const buttonHover = (e, isHover) => {
    e.target.style.backgroundColor = isHover ? '#ff4757' : '#ff6b6b';
  };

  return (
    <Container style={{ ...styles.container, marginTop: '80px' }}>
      <h2 style={styles.title} className="text-center">Find Users Nearby</h2>
      <Row className="justify-content-center my-4">
        <Col md="6" className="text-center">
          <Button
            onClick={getUserLocation}
            style={styles.button}
            onMouseEnter={(e) => buttonHover(e, true)}
            onMouseLeave={(e) => buttonHover(e, false)}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Find Users'}
          </Button>
        </Col>
      </Row>

      {error && <AlertMessage message={error} variant="danger" />}
      {message && <AlertMessage message={message} variant="info" />}

      <UserCards nearbyUsers={nearbyUsers} />

      {location.latitude && location.longitude && (
        <MapComponent
          location={location}
          googleMapsApiKey={googleMapsApiKey}
          nearbyUsers={nearbyUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      )}
    </Container>
  );
};

const AlertMessage = ({ message, variant }) => (
  <Row className="justify-content-center">
    <Col md="6">
      <Alert variant={variant}>{message}</Alert>
    </Col>
  </Row>
);

const UserCards = ({ nearbyUsers }) => (
  <Row>
    {nearbyUsers.map((user, index) => (
      <Col key={index} md={4} className="my-3">
        <Card
          style={styles.card}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Card.Body style={styles.gradientBg}>
            <Card.Title>{user.username}</Card.Title>
            <Card.Subtitle className="mb-2">
              <i className="fas fa-envelope"></i> {user.email}
            </Card.Subtitle>
            <Card.Text>
              <i className="fas fa-map-marker-alt"></i> Latitude: {user.location.coordinates[1]} <br />
              <i className="fas fa-map-marker-alt"></i> Longitude: {user.location.coordinates[0]}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

const MapComponent = ({ location, googleMapsApiKey, nearbyUsers, selectedUser, setSelectedUser }) => (
  <div style={{ marginTop: '30px' }}>
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        center={{ lat: location.latitude, lng: location.longitude }}
        zoom={16}
        mapContainerStyle={{ height: '400px', width: '100%' }}
      >
        <Marker position={{ lat: location.latitude, lng: location.longitude }} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />
        {nearbyUsers.map((user, index) => (
          <Marker
            key={index}
            position={{ lat: user.location.coordinates[1], lng: user.location.coordinates[0] }}
            icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png' }}
            onClick={() => setSelectedUser(user)}
          />
        ))}
        {selectedUser && (
          <InfoWindow
            position={{ lat: selectedUser.location.coordinates[1], lng: selectedUser.location.coordinates[0] }}
            onCloseClick={() => setSelectedUser(null)}
          >
            <div>
              <h3>{selectedUser.username}</h3>
              <p>Latitude: {selectedUser.location.coordinates[1]}</p>
              <p>Longitude: {selectedUser.location.coordinates[0]}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  </div>
);

const styles = {
  container: {
    background: 'linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%)',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    color: 'black',
    marginTop: '30px',
  },
  title: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '2.5rem',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    marginBottom: '30px',
  },
  button: {
    backgroundColor: '#ff6b6b',
    border: 'none',
    fontSize: '1.2rem',
    padding: '10px 20px',
    transition: 'all 0.3s ease',
  },
  card: {
    backgroundColor: '#2f3542',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    transition: 'transform 0.3s ease',
    color: '#fff',
  },
  gradientBg: {
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  },
};

export default FindUsersNearby;
