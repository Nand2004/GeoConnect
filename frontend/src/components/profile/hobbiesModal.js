import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { 
  FaGlobeAmericas, FaCamera, FaMusic, FaBook, FaFutbol, 
  FaGamepad, FaFilm, FaDumbbell, FaPalette, FaPen,
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
      await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/userUpdateHobbies`, {
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

export default {hobbyIcons, HobbiesModal};