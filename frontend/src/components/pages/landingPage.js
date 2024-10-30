import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaMapMarkerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Landingpage = () => {
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center position-relative"
      style={{
        background:
          "linear-gradient(135deg, #0a0a19 0%, #1a1a4a 50%, #0a0a19 100%)",
        color: "white",
        minHeight: "100vh",
        fontFamily: "Montserrat, sans-serif",
        padding: "40px",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <div
        className="position-absolute"
        style={{
          top: "-10%",
          left: "-10%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0) 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          animation: "float 10s infinite ease-in-out",
        }}
      />
      <div
        className="position-absolute"
        style={{
          bottom: "-15%",
          right: "-5%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0) 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          animation: "float 14s infinite ease-in-out reverse",
        }}
      />

      {/* Logo */}

      <Row className="justify-content-center text-center w-100">
        <Col md={8} lg={6}>
          <Card
            className="landing-card"
            style={{
              background: "rgba(26, 26, 46, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "40px 20px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
              transform: "translateY(0)",
              transition: "all 0.4s ease",
            }}
          >
            <Card.Body>
              <Card.Title
                style={{
                  fontSize: "48px",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                Welcome to GeoConnect
              </Card.Title>
              <Card.Subtitle
                className="mb-4"
                style={{
                  fontSize: "22px",
                  color: "#e0e0e0",
                  fontStyle: "italic",
                  letterSpacing: "0.5px",
                }}
              >
                Your Gateway to Real-World Connections
              </Card.Subtitle>
              <Card.Text
                style={{
                  fontSize: "18px",
                  lineHeight: "1.8",
                  marginBottom: "40px",
                  color: "#d3d3d3",
                }}
              >
                Join GeoConnect and meet new people in your vicinity with ease.
                Discover friends, partners, or study buddies right around the
                corner. GeoConnect connects your world.
              </Card.Text>
              <div className="d-flex justify-content-center gap-4">
                <Button
                  variant="outline-light"
                  href="/signup"
                  className="action-button"
                  style={{
                    fontSize: "18px",
                    padding: "12px 32px",
                    borderRadius: "12px",
                    fontWeight: "600",
                    borderWidth: "2px",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    background: "transparent",
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outline-light"
                  href="/login"
                  className="action-button"
                  style={{
                    fontSize: "18px",
                    padding: "12px 32px",
                    borderRadius: "12px",
                    fontWeight: "600",
                    borderWidth: "2px",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    background: "transparent",
                  }}
                >
                  Login
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx="true">{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, 30px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .landing-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        }

        .action-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          border-color: #ffd700;
          color: #ffd700;
        }

        .action-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: 0.5s;
        }

        .action-button:hover::before {
          left: 100%;
        }
      `}</style>
    </Container>
  );
};

export default Landingpage;
