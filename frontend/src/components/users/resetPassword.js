import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaLock, FaEye, FaEyeSlash, FaMapMarkerAlt
} from 'react-icons/fa';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { resetToken } = useParams();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1;
    return strength;
  };

  useEffect(() => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/resetPassword/${resetToken}`;
      await axios.post(url, { newPassword: password });
      
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "An error occurred");
      } else {
        setError("Network error. Please try again.");
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
          <div className="col-12 col-md-6 col-md-5">
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
                  Reset Password
                </h2>
                <p style={{
                  color: '#8892B0',
                  fontSize: '1.1rem',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}>
                  Create a new strong password
                </p>
              </div>
              <div className="card-body p-2">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
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
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'white'
                        }}
                      />
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
                    Reset Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;