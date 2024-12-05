import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/forgot-password`;
      const response = await axios.post(url, { email });
      
      setSuccess("Password reset link sent to your email. Please check your inbox.");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "An error occurred");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

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
                  Forgot Password
                </h2>
                <p style={{
                  color: '#8892B0',
                  fontSize: '1.1rem',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}>
                  Enter your email and we'll send you a link to reset your password
                </p>
              </div>
              <div className="card-body p-2">
                <form onSubmit={handleSubmit}>
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
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                  {success && (
                    <div
                      className="alert text-center"
                      style={{
                        color: '#2ECC71',
                        background: 'rgba(46, 204, 113, 0.1)',
                        border: '1px solid rgba(46, 204, 113, 0.2)',
                        padding: '10px', 
                        fontSize: '0.9rem', 
                      }}
                    >
                      {success}
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
                    Send Reset Link
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

export default ForgotPassword;