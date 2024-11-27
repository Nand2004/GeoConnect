import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const Register = () => {
  document.body.style.backgroundColor = "#0c0c1f"; // Set the background color
  const [data, setData] = useState({ username: "", email: "", password: "", latitude: null, longitude: null });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setData((prevData) => ({
          ...prevData,
          latitude: latitude,
          longitude: longitude,
        }));
      }, (error) => {
        console.error("Error fetching location:", error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    // Get user's location on component mount
    getUserLocation();
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.latitude === null || data.longitude === null) {
      setError("Unable to retrieve location. Please enable location services.");
      return;
    }

    try {
      const { data: res } = await axios.post(url, data);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom vh-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <Card
                className="text-center"
                style={{
                  background: "rgba(26, 26, 46, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  padding: "40px 20px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                }}
              >
                <Card.Title style={{ fontSize: "36px", color: "#FFD700", fontWeight: "bold" }}>
                  Join the GeoConnect Community!
                </Card.Title>
                <Card.Text style={{ fontSize: "18px", color: "#e0e0e0", marginBottom: "30px" }}>
                  Connect with people around you. Sign up to get started!
                </Card.Text>
                <hr style={{ border: "1px solid #FFD700", width: "60%", margin: "0 auto 20px" }} />
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label style={{ color: "#FFD700", fontWeight: "bold" }}>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      onChange={handleChange}
                      placeholder="Enter username"
                      style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", color:"white" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{ color: "#FFD700", fontWeight: "bold" }}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      onChange={handleChange}
                      placeholder="Enter email"
                      style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", color:"white"}}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{ color: "#FFD700", fontWeight: "bold" }}>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      onChange={handleChange}
                      placeholder="Password"
                      style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", color:"white" }}
                    />
                  </Form.Group>

                  {error && <div style={{ color: "#FF4500", fontSize: "1rem" }}>{error}</div>}

                  <Button variant="outline-warning" type="submit" className="mt-3">Register</Button>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
