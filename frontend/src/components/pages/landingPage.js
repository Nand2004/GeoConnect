import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

const Landingpage = () => {
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: '#0c0c1f',
        color: 'white',
        minHeight: '100vh',
        fontFamily: 'Montserrat',
        padding: '30px',
      }}
    >
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card
            className="text-center shadow-lg"
            style={{
              backgroundColor: '#1a1a2e', // Slightly different shade for contrast
              color: 'white',
              border: 'none',
              borderRadius: '10px',
            }}
          >
            <Card.Body>
              <Card.Title style={{ fontSize: '36px', marginBottom: '20px' }}>
                Welcome to GeoConnect
              </Card.Title>
              <Card.Subtitle
                className="mb-4 text-muted"
                style={{ fontSize: '18px', color: '#d1d1d1' }}
              >
                Connecting You to the World Around You
              </Card.Subtitle>
              <Card.Text style={{ fontSize: '16px' }}>
                Discover new connections in real-time with GeoConnect. Use our platform to connect with people nearby based on your interests and activities. Whether you're looking to network, find a study buddy, or just meet new friends, GeoConnect brings the world closer to you.
              </Card.Text>
              <div className="d-flex justify-content-center mb-4">
                <Button variant="outline-light" href="/signup" className="mx-2" style={{ fontSize: '18px' }}>
                  Sign Up
                </Button>
                <Button variant="outline-light" href="/login" className="mx-2" style={{ fontSize: '18px' }}>
                  Login
                </Button>
              </div>
            </Card.Body>
            <Card.Img
              variant="bottom"
              src="https://external-preview.redd.it/KWkc0wreGafiCXOXC2ymxUv3qmoHTwK6cDZLOwxiBIg.png?auto=webp&s=97c093a33170d7c1f7b5250debe109aaacba3ce5"
              style={{ borderRadius: '0 0 10px 10px' }}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Landingpage;
