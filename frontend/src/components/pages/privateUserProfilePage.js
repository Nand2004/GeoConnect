import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";

// Link to service
// http://localhost:8096/privateUserProfile

// A change for future, we can add a radius option, which will allow the user to decide how far the users he wants.

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  document.body.style.backgroundColor = "#0c0c1f";

  // Handle logout button
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  if (!user) return <div><h4>Log in to view this page.</h4></div>;

  const { id, email, username } = user;

  return (
    <div style={styles.profileContainer}>
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <img
            src={user.profilePic || "defaultProfilePic.png"}
            alt="Profile"
            style={styles.profilePic}
          />
          <h2 style={styles.username}>{username}</h2>
          <span style={styles.handle}>@{username}</span>
          <Button variant="link" onClick={() => alert("Edit profile coming soon!")}>
            Edit Profile
          </Button>
        </div>

        <div style={styles.profileInfo}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>User ID:</span>
            <span>{id}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Email:</span>
            <span>{email}</span>
          </div>
        </div>

        <div style={styles.profileStats}>
          <h3>Activity Summary</h3>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Connections</span>
            <span style={styles.statValue}>5</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Chats Opened</span>
            <span style={styles.statValue}>12</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Nearby People Found</span>
            <span style={styles.statValue}>3</span>
          </div>
        </div>

        <div style={styles.profileActions}>
          <Button variant="outline-light" style={styles.privacyButton} onClick={() => alert("Privacy settings coming soon!")}>
            Privacy Settings
          </Button>
          <Button variant="outline-danger" style={styles.logoutButton} onClick={handleShow}>
            Log Out
          </Button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleLogout}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = {
  profileContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: "#0c0c1f",
  },
  profileCard: {
    width: "100%",
    maxWidth: "500px",
    padding: "30px",
    background: "linear-gradient(135deg, #2b2d42, #3d405b)",
    borderRadius: "15px",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.5)",
    textAlign: "center",
    color: "white",
    transform: "scale(1)",
    transition: "transform 0.3s ease",
  },
  profileHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  profilePic: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    marginBottom: "10px",
    border: "3px solid #61dafb",
    transition: "transform 0.3s ease",
  },
  username: {
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
  handle: {
    color: "#b8b8d1",
    fontSize: "0.95rem",
  },
  profileInfo: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: "10px",
  },
  infoItem: {
    margin: "10px 0",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#a1a1c1",
  },
  profileStats: {
    marginTop: "30px",
  },
  statItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 15px",
    borderRadius: "8px",
    backgroundColor: "#282c34",
    marginBottom: "10px",
  },
  statLabel: {
    fontWeight: "600",
    color: "#61dafb",
  },
  statValue: {
    fontWeight: "600",
    color: "#fff",
  },
  profileActions: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  },
  privacyButton: {
    border: "1px solid #61dafb",
    color: "#61dafb",
    borderRadius: "8px",
    padding: "10px 20px",
    transition: "background-color 0.3s ease",
  },
  logoutButton: {
    border: "1px solid #ff4f4f",
    color: "#ff4f4f",
    borderRadius: "8px",
    padding: "10px 20px",
    transition: "background-color 0.3s ease",
  },
};

export default PrivateUserProfile;
