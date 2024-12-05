import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaMapMarkerAlt 
} from 'react-icons/fa';

const PRIMARY_COLOR = "#FFA500";
const SECONDARY_COLOR = "#0A192F";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;

const Login = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;
      localStorage.setItem("accessToken", accessToken);
      navigate('/privateUserProfile', { replace: true });
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #0A192F, #112240)',
        height: '100vh', // Use 100vh instead of minHeight to fix the height
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        position: 'fixed',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 165, 0, 0.2) 0%, rgba(255, 165, 0, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 10s infinite ease-in-out'
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 14s infinite ease-in-out reverse'
        }}
      />

      <div
        style={{
          background: 'rgba(17, 34, 64, 0.9)',
          borderRadius: '15px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
          padding: '40px',
          width: '100%',
          maxWidth: '500px',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 10
        }}
      >
        {/* Header Section */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1,
          textAlign: 'center', 
        }}>
          <FaMapMarkerAlt 
            style={{ 
              fontSize: '4rem', 
              color: PRIMARY_COLOR, 
              marginBottom: '20px',
              textShadow: '0 0 10px rgba(255,165,0,0.5)'
            }} 
          />
          <h2 style={{ 
            color: PRIMARY_COLOR, 
            fontSize: '2.5rem', 
            fontWeight: '700',
            marginBottom: '15px'
          }}>
            Welcome Back
          </h2>
          <p style={{ 
            color: '#8892B0', 
            fontSize: '1.1rem',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Connect with your passions, continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <FaUser style={{ color: PRIMARY_COLOR, marginRight: '15px', fontSize: '1.2rem' }} />
            <input
              type="text"
              name="username"
              value={data.username}
              placeholder="Enter your username"
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
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              ...(passwordFocus ? {
                boxShadow: `0 0 15px rgba(255, 165, 0, 0.5)`,
                border: `1px solid ${PRIMARY_COLOR}40`
              } : {})
            }}
          >
            <FaLock style={{ color: PRIMARY_COLOR, marginRight: '15px', fontSize: '1.2rem' }} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              placeholder="Enter your password"
              onChange={handleChange}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
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
                style={{ color: PRIMARY_COLOR, cursor: 'pointer', fontSize: '1.2rem' }}
              />
            ) : (
              <FaEye 
                onClick={() => setShowPassword(true)}
                style={{ color: PRIMARY_COLOR, cursor: 'pointer', fontSize: '1.2rem' }}
              />
            )}
          </div>

          {/* Forgot Password */}
          <div style={{ 
            textAlign: 'right', 
            marginBottom: '20px' 
          }}>
            <Link 
              to="/forgot-password" 
              style={{ 
                color: '#8892B0', 
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.color = PRIMARY_COLOR}
              onMouseOut={(e) => e.target.style.color = '#8892B0'}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              style={{ 
                color: '#FF6B6B', 
                background: 'rgba(255, 107, 107, 0.1)', 
                padding: '15px', 
                borderRadius: '10px', 
                marginBottom: '40px',
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
              background: 'linear-gradient(135deg, #FFA500, #FF6B6B)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 10px 20px rgba(255, 165, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Log In
          </button>

          {/* Sign Up Link */}
          <div 
            style={{ 
              marginTop: '20px', 
              textAlign: 'center', 
              color: '#8892B0' 
            }}
          >
            Don't have an account? {' '}
            <Link 
              to="/signup"
              style={{ 
                color: PRIMARY_COLOR,
                fontWeight: 'bold',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#FF6B6B'}
              onMouseOut={(e) => e.target.style.color = PRIMARY_COLOR}
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>

      {/* Global Styles */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
      `}</style>
    </div>
  );
};

export default Login;