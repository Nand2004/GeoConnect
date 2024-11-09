import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [imageFile, setImageFile] = useState(null);  // For image upload
  const [profileImage, setProfileImage] = useState(""); // State to store profile image URL
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  document.body.style.backgroundColor = "#0c0c1f";

  // Handle logout button
  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
    window.location.reload();
  };

  // Fetch user data on component mount
useEffect(() => {
  const userInfo = getUserInfo();
  setUser(userInfo);

  // Fetch user profile image from the backend (example API endpoint)
  axios.get(`http://localhost:8081/user/${userInfo.id}/profile-image`)
    .then((res) => {
      // Use fetched profile image if available, otherwise use default
      const fetchedProfileImage = res.data.profileImage ? res.data.profileImage : "default-profile-image-url";
      setProfileImage(fetchedProfileImage);  // Set profile image in state
    })
    .catch((error) => {
      console.error("Error fetching profile image:", error);
      // Use default image in case of error
      setProfileImage("default-profile-image-url");
    });
}, []);


  // Handle image file selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle profile image upload
  const uploadProfileImage = async () => {
    if (!imageFile) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', imageFile);
    formData.append('name', user.username);

    try {
      // Upload image to the backend
      const response = await axios.post('http://localhost:8081/image/profileImageUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // After upload, update the profile image state with the new image URL
      setProfileImage(response.data.imageUri);  // Update the profile image URL with the backend response

      alert('Profile image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Error uploading profile image');
    }
  };

  // Handle profile image removal
  const removeProfileImage = async () => {
    try {
      const response = await axios.post('http://localhost:8081/image/profileImageRemove', {
        name: user.username,
      });

      // After removal, reset to default or empty
      setProfileImage("default-profile-image-url");  // Reset to a default image

      alert('Profile image removed successfully!');
    } catch (error) {
      console.error('Error removing profile image:', error);
      alert('Error removing profile image');
    }
  };

  if (!user || !user.id) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white' }}>
        <h4>Log in to view this page.</h4>
      </div>
    );
  }

  const { id, email, username } = user;

  return (
    <div style={styles.profileContainer}>
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          {/* Display Profile Image */}
          <img
            src={profileImage}  // Use the profileImage state directly here
            alt="Profile"
            style={styles.profilePic}
          />
          <h2 style={styles.username}>{username}</h2>
          <span style={styles.handle}>@{username}</span>
          <Button variant="link" onClick={() => alert("Edit profile coming soon!")}>
            Edit Profile
          </Button>

          {/* Profile Image Upload and Remove */}
          <div style={{ marginTop: "20px" }}>
            <input type="file" onChange={handleImageChange} />
            <Button variant="outline-light" onClick={uploadProfileImage} style={{ marginTop: "10px", marginRight: "10px" }}>
              Upload Profile Image
            </Button>
            <Button variant="outline-danger" onClick={removeProfileImage} style={{ marginTop: "10px" }}>
              Remove Profile Image
            </Button>
          </div>
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
        <Modal.Header
          closeButton
          style={{ background: "linear-gradient(135deg, #0c0c1f, #1a1a4a)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#fff" }}
        >
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "rgba(26, 26, 46, 0.8)", color: "#d3d3d3" }}>
          Are you sure you want to log out?
        </Modal.Body>
        <Modal.Footer style={{ background: "rgba(26, 26, 46, 0.8)", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <Button variant="secondary" onClick={handleClose} style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", color: "#fff" }}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogout} style={{ background: "linear-gradient(135deg, #FFD700, #cc5c99)", border: "none", color: "#fff" }}>
            Yes
          </Button>
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
