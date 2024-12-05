import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt, FaUser, FaEnvelope, FaLock,
  FaEye, FaEyeSlash, FaPlane, FaCamera, FaMusic, FaBook,
  FaFutbol, FaGamepad, FaCookie, FaDumbbell,
  FaPalette, FaPen
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const hobbyData = [
  { name: "Traveling", icon: FaPlane, color: "#6A5ACD" },
  { name: "Photography", icon: FaCamera, color: "#20B2AA" },
  { name: "Music", icon: FaMusic, color: "#4169E1" },
  { name: "Reading", icon: FaBook, color: "#DAA520" },
  { name: "Sports", icon: FaFutbol, color: "#8A2BE2" },
  { name: "Gaming", icon: FaGamepad, color: "#FF7F50" },
  { name: "Cooking", icon: FaCookie, color: "#2E8B57" },
  { name: "Fitness", icon: FaDumbbell, color: "#FF6347" },
  { name: "Art", icon: FaPalette, color: "#9370DB" },
  { name: "Writing", icon: FaPen, color: "#3CB371" }
];

const Register = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    latitude: null,
    longitude: null,
    hobbies: []
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setData((prevData) => ({
            ...prevData,
            latitude: latitude,
            longitude: longitude,
          }));
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleHobbyChange = (hobby) => {
    setData((prevData) => {
      const updatedHobbies = prevData.hobbies.includes(hobby)
        ? prevData.hobbies.filter((h) => h !== hobby)
        : [...prevData.hobbies, hobby];
      return { ...prevData, hobbies: updatedHobbies };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.latitude === null || data.longitude === null) {
      setError("Unable to retrieve location. Please enable location services.");
      return;
    }

    if (data.hobbies.length < 3) {
      setError("Please select at least 3 hobbies.");
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

  const passwordStrengthColors = ['#DC143C', '#FF4500', '#FFD700', '#32CD32', '#4169E1'];

  return (
    <div className="vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #0A192F, #112240)',
      paddingTop: '55px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-md-5"> {/* Reduced column width */}
            <div
              className="card shadow-lg border-0 rounded-3 overflow-hidden"
              style={{
                background: 'rgba(17, 34, 64, 0.9)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <div
                className="card-header text-center py-2"
                style={{
                  background: 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <FaMapMarkerAlt
                  style={{
                    fontSize: '4rem',
                    color: '#FFA500',
                    marginBottom: '20px',
                    textShadow: '0 0 10px rgba(255,165,0,0.5)'
                  }}
                />
                <h2 style={{
                  color: '#FFA500',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '15px'
                }}>
                  GeoConnect
                </h2>
                <p style={{
                  color: '#8892B0',
                  fontSize: '1.1rem',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}>
                  Create your account and start connecting with people who share your passions
                </p>
              </div>
              <div className="card-body p-2">
                <form onSubmit={handleSubmit}>
                  {/* Input Fields with Original Styling */}
                  <div className="mb-3">
                    <div
                      className="input-group mb-3"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      <span
                        className="input-group-text"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#FFA500'
                        }}
                      >
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={data.username}
                        placeholder="Choose a unique username"
                        onChange={handleChange}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'white'
                        }}
                      />
                    </div>

                    {/* Similar styling for email and password inputs */}
                    <div
                      className="input-group mb-3"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      <span
                        className="input-group-text"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#FFA500'
                        }}
                      >
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={data.email}
                        placeholder="Enter your email address"
                        onChange={handleChange}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'white'
                        }}
                      />
                    </div>

                    {/* Password input with original styling */}
                    <div
                      className="input-group mb-2"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      <span
                        className="input-group-text"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#FFA500'
                        }}
                      >
                        <FaLock />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        name="password"
                        value={data.password}
                        placeholder="Create a strong password"
                        onChange={handleChange}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'white'
                        }}
                      />
                      <button
                        className="btn"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          background: 'transparent',
                          color: '#FFA500',
                          border: 'none'
                        }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="progress mb-3" style={{ height: '6px' }}>
                      {[...Array(5)].map((_, index) => (
                        <div
                          key={index}
                          className="progress-bar"
                          style={{
                            width: '20%',
                            backgroundColor: index < passwordStrength
                              ? passwordStrengthColors[index]
                              : 'rgba(255,255,255,0.1)'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hobbies Section */}
                  <div className="mb-4">
                    <h5 className="text-center" style={{ color: '#FFA500', marginBottom: '25px' }}>
                      Select at least 3 hobbies that define you
                    </h5>
                    <div className="row row-cols-3 row-cols-md-5 g-2">
                      {hobbyData.map(({ name, icon: Icon, color }) => (
                        <div className="col" key={name}>
                          <div
                            onClick={() => handleHobbyChange(name)}
                            className="hobby-card"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              padding: '15px',
                              borderRadius: '12px',
                              background: data.hobbies.includes(name)
                                ? `${color}20`
                                : 'rgba(255,255,255,0.05)',
                              border: data.hobbies.includes(name)
                                ? `1px solid ${color}40`
                                : '1px solid rgba(255,255,255,0.1)',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              transform: data.hobbies.includes(name) ? 'scale(1.05)' : 'scale(1)',
                              boxShadow: data.hobbies.includes(name)
                                ? `0 5px 15px rgba(0,0,0,0.1), 0 0 10px ${color}30`
                                : 'none'
                            }}
                          >
                            <Icon
                              style={{
                                color: data.hobbies.includes(name)
                                  ? color
                                  : '#8892B0',
                                fontSize: '1.8rem',
                                marginBottom: '8px'
                              }}
                            />
                            <span
                              style={{
                                color: data.hobbies.includes(name)
                                  ? color
                                  : '#8892B0',
                                fontSize: '0.8rem',
                                fontWeight: data.hobbies.includes(name) ? '600' : '400'
                              }}
                            >
                              {name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div
                      className="alert text-center"
                      style={{
                        color: '#FF6B6B',
                        background: 'rgba(255, 107, 107, 0.1)',
                        border: '1px solid rgba(255, 107, 107, 0.2)',
                        padding: '10px', 
                        fontSize: '0.9rem', 
                        maxHeight: '60px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap', 
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn w-100 mt-3"
                    style={{
                      background: 'linear-gradient(135deg, #FFA500, #FF6B6B)',
                      color: 'white',
                      padding: '15px',
                      fontWeight: 'bold'
                    }}
                  >
                    Register
                  </button>
                </form>

                <div className="card-footer text-center py-3">
                  <p className="text-white-50 mb-2">Already have an account?</p>
                  <Link
                    to="/login"
                    className="btn btn-outline-light"
                    style={{
                      borderColor: '#FFA500',
                      color: '#FFA500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Log In
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hobby-card {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hobby-card:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Register;