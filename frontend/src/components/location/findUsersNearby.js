import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

const FindUsersNearby = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Get user's location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    setMessage('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          findUsersNearby(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLoading(false);
          setError('Error getting your location. Please enable location access.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  // Call API to find nearby users
  const findUsersNearby = async (latitude, longitude) => {
    try {
      const response = await axios.get(`http://localhost:8081/user/locationGetNearby`, {
        params: {
          latitude,
          longitude,
          distance: 5000, // Customize the distance
        },
      });
      setNearbyUsers(response.data);
      if (response.data.length === 0) {
        setMessage('No users found nearby.');
      }
    } catch (error) {
      setError('Error finding nearby users.');
    }
    setLoading(false);
  };

  // Inline Styles
  const containerStyle = {
    background: 'linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%)',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    color: 'white',
    marginTop: '30px',
  };

  const titleStyle = {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '2.5rem',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    marginBottom: '30px',
  };

  const buttonStyle = {
    backgroundColor: '#ff6b6b',
    border: 'none',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease',
    padding: '10px 20px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#ff4757',
    transform: 'scale(1.05)',
  };

  const cardStyle = {
    backgroundColor: '#2f3542',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    transition: 'transform 0.3s ease',
    color: '#fff',
  };

  const cardHoverStyle = {
    transform: 'scale(1.05)',
  };

  const gradientBgStyle = {
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  };

  return (
    <Container style={containerStyle}>
      <h2 style={titleStyle} className="text-center">Find Users Nearby</h2>
      <Row className="justify-content-center my-4">
        <Col md="6" className="text-center">
          <Button
            onClick={getUserLocation}
            style={buttonStyle}
            className="find-users-btn"
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#ff4757')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff6b6b')}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Find Users'}
          </Button>
        </Col>
      </Row>

      {error && (
        <Row className="justify-content-center">
          <Col md="6">
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {message && (
        <Row className="justify-content-center">
          <Col md="6">
            <Alert variant="info">{message}</Alert>
          </Col>
        </Row>
      )}

      {nearbyUsers.length > 0 && (
        <Row>
          {nearbyUsers.map((user, index) => (
            <Col key={index} md={4} className="my-3">
              <Card
                style={cardStyle}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                className="gradient-bg"
              >
                <Card.Body style={gradientBgStyle}>
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
      )}
    </Container>
  );
};

export default FindUsersNearby;
