import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import getUserInfo from "../../utilities/decodeJwt";

const PRIMARY_COLOR = "#cc5c99";
const SECONDARY_COLOR = "#0c0c1f";
const url = "http://localhost:8081/user/login";

const Login = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    const obj = getUserInfo(user);
    setUser(obj);
    setBgColor(light ? "white" : SECONDARY_COLOR);
    setBgText(light ? "Dark mode" : "Light mode");
  }, [light]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;
      localStorage.setItem("accessToken", accessToken);
      // Reload current page and navigate to privateUserProfile
      navigate('/privateUserProfile', { replace: true });
      window.location.reload();

    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  if (user) {
    navigate('/privateUserProfile');
    return null;
  }

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center position-relative"
      style={{
        background: "linear-gradient(135deg, #0a0a19 0%, #1a1a4a 50%, #0a0a19 100%)",
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

      <Card
        style={{
          background: "rgba(26, 26, 46, 0.9)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "25px",
          padding: "50px",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5)",
          width: "100%",
          maxWidth: "500px",
          transform: "translateY(0)",
          transition: "all 0.4s ease",
        }}
      >
        <Card.Body>
          <Card.Title
            style={{
              fontSize: "42px",
              marginBottom: "25px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            Log In to GeoConnect
          </Card.Title>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label
                style={{
                  background: "linear-gradient(135deg, #FFD700, #cc5c99)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "600",
                }}
              >
                Username
              </Form.Label>
              <Form.Control
                type="username"
                name="username"
                onChange={handleChange}
                placeholder="Enter username"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label
                style={{
                  background: "linear-gradient(135deg, #FFD700, #cc5c99)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "600",
                }}
              >
                Password
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
                }}
              />
            </Form.Group>
            <Form.Text className="text-muted mb-4 d-block" style={{ color: "black", fontSize: '16px' }}>
              Don’t have an account?{" "}
              <Link to="/signup" 
                  style={{ 
                    background: "linear-gradient(135deg, #FFD700, #cc5c99)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "600",
                    fontSize: '19px',

                  }}>
                    Sign up
              </Link>
            </Form.Text>
            {error && <div style={{ color: PRIMARY_COLOR }}>{error}</div>}
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmit}
              style={{
                background: "transparent",
                color: "#FFD700",
                borderWidth: "2px",
                borderColor: "#FFD700",
                fontSize: "20px",
                padding: "12px 35px",
                borderRadius: "10px",
                fontWeight: "700",
                transition: "all 0.3s ease",
              }}
              className="w-100"
            >
              Log In
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <style jsx="true">{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 20px);
          }
        }

        .action-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 25px rgba(255, 215, 0, 0.4);
          border-color: #ffd700;
          color: #ffd700;
        }
      `}</style>
    </Container>
  );
};

export default Login;
