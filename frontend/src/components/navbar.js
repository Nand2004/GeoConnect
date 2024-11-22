import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaMapMarkerAlt } from 'react-icons/fa';
import getUserInfo from '../utilities/decodeJwt';
import NotificationDropdown from './chat/notificationToast/notificationDropdown';
import { io } from 'socket.io-client';
import axios from 'axios';

const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const user = getUserInfo();
    setCurrentUser(user);
    setIsLoggedIn(user && user.id);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:8081");
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && currentUser) {
      const handleMessage = async (message) => {
        if (message.sender !== currentUser.id) {
          try {
            const response = await axios.get(
              `http://localhost:8081/user/getUsernameByUserId/${message.sender}`
            );
            const senderUsername = response.data.username;

            const notification = {
              id: Date.now(),
              message: message.attachments?.length
                ? "📎 Sent an image"
                : message.message,
              sender: message.sender,
              senderUsername: senderUsername,
              chatId: message.chatId,
              timestamp: new Date().toISOString(),
            };

            setNotifications(prev => [...prev, notification]);
          } catch (error) {
            console.error("Error fetching sender info:", error);
          }
        }
      };

      socket.on("listeningMessage", handleMessage);
      return () => {
        socket.off("listeningMessage", handleMessage);
      };
    }
  }, [socket, currentUser]);

  const navLinks = [
    { href: "/privateUserProfile", label: "Profile" },
    { href: "/event", label: "Event" },
    { href: "/findUsersNearby", label: "Users Nearby" },
    { href: "/chat", label: "Chat" },
  ];

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        background: scrolled ? 'rgba(10, 10, 25, 0.95)' : 'rgba(10, 10, 25, 0.7)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease-in-out',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        padding: '10px 0',
      }}
    >
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center" style={{ gap: '10px' }}>
          <FaMapMarkerAlt style={iconStyle} />
          <span style={brandStyle}>GeoConnect</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ border: 'none', padding: '0.25rem' }}>
          {[...Array(3)].map((_, index) => (
            <span key={index} style={toggleLineStyle} />
          ))}
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" style={{ gap: '10px', alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                <NotificationDropdown 
                  notifications={notifications}
                  onNotificationsClear={handleClearNotifications}
                />
                {navLinks.map(({ href, label }) => (
                  <Nav.Link key={label} href={href} style={linkStyle}>
                    {label}
                  </Nav.Link>
                ))}
              </>
            ) : (
              <Button variant="outline-light" href="/login" style={buttonStyle}>
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style jsx="true">{`
        .custom-navbar {
          box-shadow: ${scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'};
        }
        .nav-link-custom:hover {
          color: #FFD700 !important;
        }
        @media (max-width: 991px) {
          .nav-link-custom {
            padding: 10px 0 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .nav-button {
            margin: 10px 0 !important;
            width: 100%;
          }
        }
      `}</style>
    </Navbar>
  );
};

// Styles (keep existing styles from previous implementation)
const iconStyle = {
  fontSize: '28px',
  color: '#FFD700',
  filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))',
  transition: 'all 0.3s ease',
};

const brandStyle = {
  color: 'white',
  fontSize: '22px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const linkStyle = {
  color: 'rgba(255, 255, 255, 0.8)',
  padding: '10px 16px',
  transition: 'all 0.3s ease',
  fontSize: '18px',
  position: 'relative',
};

const buttonStyle = {
  borderRadius: '8px',
  padding: '10px 20px',
  fontWeight: '500',
  marginLeft: '10px',
  border: '1.5px solid rgba(255, 215, 0, 0.5)',
  color: '#FFD700',
  background: 'transparent',
  transition: 'all 0.3s ease',
};

const toggleLineStyle = {
  display: 'block',
  width: '25px',
  height: '2px',
  marginBottom: '5px',
  position: 'relative',
  background: '#FFD700',
  borderRadius: '2px',
  transformOrigin: '0 0',
  transition: 'transform 0.3s ease-in-out',
};

export default NavigationBar;