import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaMapMarkerAlt, FaUser, FaEnvelope, FaLock, 
  FaEye, FaEyeSlash, FaPlane, FaCamera, FaMusic, FaBook, 
  FaFutbol, FaGamepad, FaCookie, FaDumbbell, 
  FaPalette, FaPen 
} from 'react-icons/fa';

const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const hobbyData = [
  { name: "Traveling", icon: FaPlane, color: "#FF6B6B" },
  { name: "Photography", icon: FaCamera, color: "#4ECDC4" },
  { name: "Music", icon: FaMusic, color: "#45B7D1" },
  { name: "Reading", icon: FaBook, color: "#FDCB6E" },
  { name: "Sports", icon: FaFutbol, color: "#6C5CE7" },
  { name: "Gaming", icon: FaGamepad, color: "#FF8A5B" },
  { name: "Cooking", icon: FaCookie, color: "#A8E6CF" },
  { name: "Fitness", icon: FaDumbbell, color: "#FF6B6B" },
  { name: "Art", icon: FaPalette, color: "#5F27CD" },
  { name: "Writing", icon: FaPen, color: "#2ECC71" }
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

  const passwordStrengthColors = ['#FF6B6B', '#FF9F1C', '#FFC93C', '#6BCB77', '#4D96FF'];

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #0A192F, #112240)',
        minHeight: '100vh', // Subtract navbar height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        paddingTop: '74px',
      }}
    >
      <div
        style={{
          background: 'rgba(17, 34, 64, 0.9)',
          borderRadius: '15px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
          padding: '50px',
          width: '100%',
          maxWidth: '700px',
          maxHeight: 'calc(100vh - 110px)', // Ensure it fits on screen

          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header Section */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1,
          textAlign: 'center', 
          marginBottom: '40px' 
        }}>
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

        <form onSubmit={handleSubmit}>
          {/* Input Fields */}
          <div style={{ marginBottom: '30px' }}>
            {/* Username Input */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <FaUser style={{ color: '#FFA500', marginRight: '15px', fontSize: '1.2rem' }} />
              <input
                type="text"
                name="username"
                value={data.username}
                placeholder="Choose a unique username"
                onChange={handleChange}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  flex: 1,
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Email Input */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <FaEnvelope style={{ color: '#FFA500', marginRight: '15px', fontSize: '1.2rem' }} />
              <input
                type="email"
                name="email"
                value={data.email}
                placeholder="Enter your email address"
                onChange={handleChange}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  flex: 1,
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Password Input */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <FaLock style={{ color: '#FFA500', marginRight: '15px', fontSize: '1.2rem' }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                placeholder="Create a strong password"
                onChange={handleChange}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  flex: 1,
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
              {showPassword ? (
                <FaEyeSlash 
                  onClick={() => setShowPassword(false)}
                  style={{ color: '#FFA500', cursor: 'pointer', fontSize: '1.2rem' }}
                />
              ) : (
                <FaEye 
                  onClick={() => setShowPassword(true)}
                  style={{ color: '#FFA500', cursor: 'pointer', fontSize: '1.2rem' }}
                />
              )}
            </div>

            {/* Password Strength Indicator */}
            <div style={{ 
              height: '6px', 
              display: 'flex', 
              marginBottom: '15px'
            }}>
              {[...Array(5)].map((_, index) => (
                <div 
                  key={index} 
                  style={{
                    flex: 1, 
                    marginRight: '5px', 
                    backgroundColor: index < passwordStrength 
                      ? passwordStrengthColors[index] 
                      : 'rgba(255,255,255,0.1)',
                    borderRadius: '3px',
                    transition: 'background-color 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hobby Selection */}
          <div>
            <h3 style={{ 
              color: '#FFA500', 
              marginBottom: '25px', 
              textAlign: 'center',
              fontSize: '1.3rem'
            }}>
              Select at least 3 hobbies that define you
            </h3>
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
                gap: '15px',
                justifyContent: 'center'
              }}
            >
              {hobbyData.map(({ name, icon: Icon, color }) => (
                <div
                  key={name}
                  onClick={() => handleHobbyChange(name)}
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
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              style={{ 
                color: '#FF6B6B', 
                background: 'rgba(255, 107, 107, 0.1)', 
                padding: '15px', 
                borderRadius: '10px', 
                marginTop: '25px',
                textAlign: 'center',
                border: '1px solid rgba(255, 107, 107, 0.2)'
              }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              marginTop: '30px',
              background: 'linear-gradient(135deg, #FFA500, #FF6B6B)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;