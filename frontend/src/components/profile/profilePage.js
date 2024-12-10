import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";
import {
  Camera,
  Mail,
  User,
  LogOut,
  Settings,
  Lock,
  Crown,
  BadgeCheck,
  Users,
  MessageSquare,
  MapPin,
  ChevronRight,
  Edit
} from "lucide-react";
import { FaGlobeAmericas, FaCamera, FaMusic, FaBook, FaFutbol, 
  FaGamepad, FaFilm, FaDumbbell, FaPalette, FaPen,
  FaHiking, FaPlaneDeparture, FaCookieBite, FaPuzzlePiece 
} from 'react-icons/fa';

const hobbyIcons = {
  "Traveling": FaGlobeAmericas,
  "Photography": FaCamera,
  "Music": FaMusic,
  "Reading": FaBook,
  "Sports": FaFutbol,
  "Gaming": FaGamepad,
  "Movies": FaFilm,
  "Fitness": FaDumbbell,
  "Art": FaPalette,
  "Writing": FaPen,
};

const HobbiesModal = ({ show, handleClose, userId, currentHobbies = [], onHobbiesUpdate }) => {
  const [selectedHobbies, setSelectedHobbies] = useState(currentHobbies || []);
  const [availableHobbies, setAvailableHobbies] = useState(Object.keys(hobbyIcons));

  // Reset selected hobbies when modal opens
  useEffect(() => {
    if (show) {
      setSelectedHobbies(currentHobbies || []);
    }
  }, [show, currentHobbies]);

  const toggleHobby = (hobby) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby) 
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    );
  };

  const handleSaveHobbies = async () => {
    if (selectedHobbies.length < 3) {
      alert('Please select at least 3 hobbies');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/userSetHobbies`, {
        userId,
        hobbies: selectedHobbies
      });
      onHobbiesUpdate(selectedHobbies);
      handleClose();
    } catch (error) {
      console.error('Error updating hobbies:', error);
      alert('Failed to update hobbies');
    }
  };

  const styles = {
    hobbyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      maxHeight: '400px',
      overflowY: 'auto'
    },
    hobbyButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px',
      border: '2px solid transparent',
      borderRadius: '10px',
      background: 'rgba(255,255,255,0.05)',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    selectedHobby: {
      border: '2px solid #61dafb',
      background: 'rgba(97, 218, 251, 0.1)'
    },
    hobbyIcon: {
      fontSize: '2rem',
      marginBottom: '10px'
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      size="lg"
      style={{ 
        background: 'rgba(0,0,0,0.5)' 
      }}
    >
      <Modal.Header 
        closeButton 
        style={{ 
          background: 'linear-gradient(135deg, #1a1a3a, #2b2d42)', 
          color: 'white' 
        }}
      >
        <Modal.Title>Edit Your Hobbies</Modal.Title>
      </Modal.Header>
      <Modal.Body 
        style={{ 
          background: '#1a1a3a', 
          color: 'white',
          padding: '20px' 
        }}
      >
        <p>Select at least 3 hobbies that represent you:</p>
        <div style={styles.hobbyGrid}>
          {availableHobbies.map(hobby => {
            const Icon = hobbyIcons[hobby];
            const isSelected = selectedHobbies.includes(hobby);
            return (
              <div 
                key={hobby}
                style={{
                  ...styles.hobbyButton,
                  ...(isSelected ? styles.selectedHobby : {})
                }}
                onClick={() => toggleHobby(hobby)}
              >
                <Icon 
                  style={{
                    ...styles.hobbyIcon,
                    color: isSelected ? '#61dafb' : '#8888a0'
                  }} 
                />
                <span>{hobby}</span>
              </div>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer 
        style={{ 
          background: '#1a1a3a', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
        }}
      >
        <Button 
          variant="secondary" 
          onClick={handleClose}
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            border: 'none' 
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSaveHobbies}
          style={{ 
            background: 'linear-gradient(135deg, #61dafb, #cc5c99)', 
            border: 'none' 
          }}
        >
          Save Hobbies
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ProfilePage = () => {
  const [show, setShow] = useState(false);
  const [showHobbiesModal, setShowHobbiesModal] = useState(false);
  const [user, setUser] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  document.body.style.backgroundColor = "#0c0c1f";

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
    window.location.reload();
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);

    // Fetch profile image
    axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getUserProfileImage/${userInfo.id}`)
      .then((res) => {
        const fetchedProfileImage = res.data.profileImage || "default-profile-image-url";
        setProfileImage(fetchedProfileImage);
      })
      .catch((error) => {
        console.error("Error fetching profile image:", error);
        setProfileImage("default-profile-image-url");
      });

    // Fetch user hobbies
    axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/userGetHobbies/${userInfo.id}`)
      .then((res) => {
        setHobbies(res.data.hobbies || []);
      })
      .catch((error) => {
        console.error("Error fetching hobbies:", error);
      });
  }, []);

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const uploadProfileImage = async () => {
    if (!imageFile) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', imageFile);
    formData.append('name', user.username);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/image/profileImageUpload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileImage(response.data.imageUri);
      alert('Profile image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Error uploading profile image');
    }
  };

  const removeProfileImage = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/image/profileImageRemove`, {
        name: user.username,
      });
      setProfileImage("default-profile-image-url");
      alert('Profile image removed successfully!');
    } catch (error) {
      console.error('Error removing profile image:', error);
      alert('Error removing profile image');
    }
  };

  const handleHobbiesUpdate = (updatedHobbies) => {
    setHobbies(updatedHobbies);
  };

  if (!user || !user.id) {
    return (
      <div style={styles.loginPrompt}>
        <div style={styles.loginBox}>
          <h4>Log in to view this page</h4>
          <div style={styles.loginGlow}></div>
        </div>
      </div>
    );
  }

  const { id, email, username } = user;

  const stats = [
    { 
      icon: Users, 
      label: 'Hobbies', 
      value: hobbies.length, 
      renderIcons: () => hobbies.slice(0, 3).map(hobby => {
        const Icon = hobbyIcons[hobby];
        return Icon ? <Icon key={hobby} style={styles.statIcon} size={20} /> : null;
      }) 
    },
    { icon: MessageSquare, label: 'Chats', value: 12 },
    { icon: MapPin, label: 'Found Nearby', value: 3 }
  ];

  const handleStatsClick = (label) => {
    if (label === 'Hobbies') {
      setShowHobbiesModal(true);
    }
    else if (label === 'Chats') {
      navigate('/chat'); 
    }
    else if (label === 'Found Nearby') {
      navigate('/findUsersNearby');
    }
  };

  return (
    <div style={styles.profileContainer}>
      <div style={styles.profileCard}>
        <div style={styles.topBar}>
          <div style={styles.badge}>
            <Crown size={14} style={{ marginRight: '5px' }} />
            Premium
          </div>
        </div>

        <div style={styles.profileContent}>
          <div style={styles.profileHeader}>
            <div style={styles.imageWrapper}>
              <div style={styles.imageContainer}>
                <img src={profileImage} alt="Profile" style={styles.profilePic} />
                <div style={styles.imageOverlay}>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    style={styles.fileInput} // Hidden input
                    id="fileInput"
                    accept="image/*"
                  />
                  <Button
                    variant="outline-light"
                    onClick={uploadProfileImage}
                    style={styles.uploadButton}
                  >
                    Upload Profile Image
                  </Button>
                  <label
                    htmlFor="fileInput"
                    style={styles.uploadLabel}
                    title="Click to upload image"
                  >
                    <Camera size={24} color="#fff" />
                  </label>
                </div>
              </div>
              <div style={styles.imageGlow}></div>
            </div>
          </div>
        </div>



        <div style={styles.userInfo}>
          <h2 style={styles.username}>{username}</h2>
          <span style={styles.handle}>@{username}</span>
          <div style={styles.verifiedBadge}>
            <BadgeCheck size={16} style={{ marginRight: '5px' }} />
            Verified Profile
          </div>
        </div>
      <div>

      <div style={styles.quickStats}>
          {stats.map(({ icon: Icon, label, value, renderIcons }) => (
            <div key={label} style={styles.quickStat} onClick={() => handleStatsClick(label)}>
              {label === 'Hobbies' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={20} style={styles.statIcon} />
                  {renderIcons && renderIcons()}
                  {hobbies.length === 0 && (
                    <Edit size={16} style={{ color: '#61dafb', marginLeft: '5px' }} />
                  )}
                </div>
              ) : (
                <Icon size={20} style={styles.statIcon} />
              )}
              <span style={styles.quickStatNumber}>{value}</span>
              <span style={styles.quickStatLabel}>{label}</span>
            </div>
          ))}
      </div>

      <HobbiesModal 
        show={showHobbiesModal}
        handleClose={() => setShowHobbiesModal(false)}
        userId={id}
        currentHobbies={hobbies}
        onHobbiesUpdate={handleHobbiesUpdate}
      />

      <div style={styles.mainContent}>
        <div style={styles.infoSection}>
          <h3 style={styles.sectionTitle}>Profile Information</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <User size={24} style={styles.cardIcon} />
              <div style={styles.cardContent}>
                <span style={styles.infoLabel}>User ID</span>
                <span style={styles.infoValue}>{id}</span>
              </div>
              <ChevronRight size={20} style={styles.chevron} />
            </div>
            <div style={styles.infoCard}>
              <Mail size={24} style={styles.cardIcon} />
              <div style={styles.cardContent}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{email}</span>
              </div>
              <ChevronRight size={20} style={styles.chevron} />
            </div>
          </div>
        </div>

        <div style={styles.actionsGrid}>
          <button style={styles.actionButton} onClick={() => alert("Coming soon!")}>
            <Lock size={20} />
            Privacy Settings
          </button>
          <button style={styles.actionButton} onClick={() => alert("Coming soon!")}>
            <Settings size={20} />
            Edit Profile
          </button>
          <button style={{ ...styles.actionButton, ...styles.logoutButton }} onClick={handleShow}>
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </div>
    </div>
      </div >

  <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
    <Modal.Header closeButton style={styles.modalHeader}>
      <Modal.Title>Ready to leave?</Modal.Title>
    </Modal.Header>
    <Modal.Body style={styles.modalBody}>
      <div style={styles.modalContent}>
        <LogOut size={48} style={styles.modalIcon} />
        <p>Are you sure you want to log out?</p>
      </div>
    </Modal.Body>
    <Modal.Footer style={styles.modalFooter}>
      <Button variant="secondary" onClick={handleClose} style={styles.modalButton}>
        Stay
      </Button>
      <Button variant="primary" onClick={handleLogout} style={styles.modalLogoutButton}>
        Log Out
      </Button>
    </Modal.Footer>
  </Modal>
    </div >
  );
};

const styles = {
  profileContainer: {
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",

  },
  profileCard: {
    width: "100%",
    maxWidth: "800px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "24px",
    overflow: "hidden",
    position: "relative",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  topBar: {
    padding: "15px 25px",
    background: "linear-gradient(to right, rgba(97, 218, 251, 0.1), rgba(204, 92, 153, 0.1))",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  badge: {
    background: "linear-gradient(135deg, #61dafb, #cc5c99)",
    padding: "5px 15px",
    borderRadius: "20px",
    color: "white",
    fontSize: "0.8rem",
    display: "inline-block",
    fontWeight: "500",
  },
  profileContent: {
    padding: "30px",
  },
  imageWrapper: {
    position: "relative",
    marginBottom: "30px",
  },
  imageContainer: {
    width: "150px",
    height: "150px",
    position: "relative",
    zIndex: "1",
  },
  profilePic: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid rgba(97, 218, 251, 0.5)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  imageGlow: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #61dafb, #cc5c99)",
    filter: "blur(20px)",
    opacity: "0.15",
    zIndex: "0",
  },
  userInfo: {
    textAlign: "center",
    marginBottom: "30px",
  },
  username: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "10px 0",
    background: "linear-gradient(135deg, #61dafb, #cc5c99)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  handle: {
    color: "#8888a0",
    fontSize: "1.1rem",
    display: "block",
    marginBottom: "10px",
  },
  verifiedBadge: {
    background: "rgba(97, 218, 251, 0.1)",
    color: "#61dafb",
    padding: "5px 15px",
    borderRadius: "15px",
    fontSize: "0.9rem",
    display: "inline-block",
  },
  quickStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    margin: "30px 0",
  },
  quickStat: {
    background: "rgba(255, 255, 255, 0.03)",
    padding: "20px",
    borderRadius: "20px",
    textAlign: "center",
    transition: "transform 0.3s",
    cursor: "pointer",
    '&:hover': {
      transform: "translateY(-5px)",
    },
  },
  quickStatNumber: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#61dafb",
    display: "block",
  },
  quickStatLabel: {
    color: "#8888a0",
    fontSize: "0.9rem",
    marginTop: "5px",
    display: "block",
  },
  infoSection: {
    marginBottom: "30px",
  },
  sectionTitle: {
    color: "white",
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  infoCard: {
    background: "rgba(255, 255, 255, 0.03)",
    padding: "20px",
    borderRadius: "20px",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "10px",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: "1.5rem",
    gridRow: "span 2",
  },
  infoLabel: {
    color: "#8888a0",
    fontSize: "0.9rem",
  },
  infoValue: {
    color: "white",
    fontSize: "1rem",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
  },
  actionButton: {
    background: "rgba(97, 218, 251, 0.1)",
    border: "none",
    padding: "15px",
    borderRadius: "15px",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    '&:hover': {
      background: "rgba(97, 218, 251, 0.2)",
    },
  },
  logoutButton: {
    background: "rgba(255, 75, 75, 0.1)",
    '&:hover': {
      background: "rgba(255, 75, 75, 0.2)",
    },
  },
  actionIcon: {
    fontSize: "1.2rem",
  },
  modalHeader: {
    background: "linear-gradient(135deg, #1a1a3a, #2b2d42)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    color: "white",
  },
  modalBody: {
    background: "#1a1a3a",
    color: "white",
  },
  modalContent: {
    textAlign: "center",
    padding: "20px",
  },
  modalIcon: {
    fontSize: "3rem",
    marginBottom: "15px",
    display: "block",
  },
  modalFooter: {
    background: "#1a1a3a",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  modalButton: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    padding: "8px 20px",
    borderRadius: "10px",
  },
  modalLogoutButton: {
    background: "linear-gradient(135deg, #61dafb, #cc5c99)",
    border: "none",
    padding: "8px 20px",
    borderRadius: "10px",
  },
  loginPrompt: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)",
  },
  loginBox: {
    background: "rgba(255, 255, 255, 0.03)",
    padding: "30px 50px",
    borderRadius: "20px",
    color: "white",
    position: "relative",
    overflow: "hidden",
  },
  loginGlow: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle, rgba(97, 218, 251, 0.1) 0%, transparent 70%)",
    animation: "rotate 10s linear infinite",

  },
  statIcon: {
    color: '#61dafb',
    marginBottom: '10px',
  },
  cardIcon: {
    color: '#61dafb',
  },
  chevron: {
    color: '#8888a0',
    opacity: 0.5,
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  infoCard: {
    background: "rgba(255, 255, 255, 0.03)",
    padding: "20px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    transition: "transform 0.2s",
    cursor: "pointer",
    '&:hover': {
      transform: "translateY(-2px)",
      background: "rgba(255, 255, 255, 0.05)",
    },
  },
  uploadLabel: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "rgba(97, 218, 251, 0.3)",
    transition: "background 0.3s",
    '&:hover': {
      background: "rgba(97, 218, 251, 0.5)",
    },
  },
  modalIcon: {
    color: '#61dafb',
    marginBottom: '15px',
  },
  quickStat: {
    background: "rgba(255, 255, 255, 0.03)",
    padding: "20px",
    borderRadius: "20px",
    textAlign: "center",
    transition: "all 0.3s",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    '&:hover': {
      transform: "translateY(-5px)",
      background: "rgba(255, 255, 255, 0.05)",
    },
    
  },
};

export default ProfilePage;