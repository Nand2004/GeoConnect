import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaGlobeAmericas, FaCamera, FaMusic, FaBook, FaFutbol, 
  FaGamepad, FaFilm, FaDumbbell, FaPalette, FaPen 
} from 'react-icons/fa';

const hobbyIcons = {
  "Traveling": { 
    icon: FaGlobeAmericas, 
    color: '#2196F3', // Bright Blue
    hoverColor: '#1565C0'
  },
  "Photography": { 
    icon: FaCamera, 
    color: '#FF5722', // Deep Orange
    hoverColor: '#E64A19'
  },
  "Music": { 
    icon: FaMusic, 
    color: '#9C27B0', // Purple
    hoverColor: '#6A1B9A'
  },
  "Reading": { 
    icon: FaBook, 
    color: '#4CAF50', // Green
    hoverColor: '#2E7D32'
  },
  "Sports": { 
    icon: FaFutbol, 
    color: '#FF9800', // Orange
    hoverColor: '#F57C00'
  },
  "Gaming": { 
    icon: FaGamepad, 
    color: '#673AB7', // Deep Purple
    hoverColor: '#512DA8'
  },
  "Movies": { 
    icon: FaFilm, 
    color: '#F44336', // Red
    hoverColor: '#D32F2F'
  },
  "Fitness": { 
    icon: FaDumbbell, 
    color: '#00BCD4', // Cyan
    hoverColor: '#0097A7'
  },
  "Art": { 
    icon: FaPalette, 
    color: '#E91E63', // Pink
    hoverColor: '#C2185B'
  },
  "Writing": { 
    icon: FaPen, 
    color: '#795548', // Brown
    hoverColor: '#5D4037'
  }
};

const UserHobbies = ({ userId }) => {
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredHobby, setHoveredHobby] = useState(null);

  useEffect(() => {
    const fetchUserHobbies = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/userGetHobbies/${userId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const fetchedHobbies = Array.isArray(response.data) 
          ? response.data 
          : (response.data.hobbies || []);

        setHobbies(fetchedHobbies);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setHobbies([]);
        setLoading(false);
      }
    };

    fetchUserHobbies();
  }, [userId]);

  const styles = {
    hobbiesContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '0.75rem',
      marginTop: '0.5rem',
      minHeight: '24px',
    },
    hobbyIcon: {
      fontSize: '1.5rem',
      cursor: 'help',
      transition: 'all 0.3s ease',
      transform: 'scale(1)',
      opacity: 0.7,
    },
    hobbyIconHovered: {
      transform: 'scale(1.3)',
      opacity: 1,
      boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    },
    noHobbiesText: {
      fontSize: '0.8rem',
      color: '#94A3B8',
      fontStyle: 'italic',
    },
    errorText: {
      fontSize: '0.8rem',
      color: '#EF4444',
      fontStyle: 'italic',
    }
  };

  if (loading) {
    return <div style={styles.hobbiesContainer}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={styles.hobbiesContainer}>
        <span style={styles.errorText}>Error: {error}</span>
      </div>
    );
  }

  if (hobbies.length === 0) {
    return (
      <div style={styles.hobbiesContainer}>
        <span style={styles.noHobbiesText}>No hobbies set</span>
      </div>
    );
  }

  return (
    <div style={styles.hobbiesContainer}>
      {hobbies.map((hobby, index) => {
        const hobbyData = hobbyIcons[hobby];
        if (!hobbyData) return null;

        const Icon = hobbyData.icon;
        const isHovered = hoveredHobby === index;

        return (
          <Icon 
            key={index} 
            style={{
              ...styles.hobbyIcon,
              ...(isHovered ? styles.hobbyIconHovered : {}),
              color: isHovered ? hobbyData.hoverColor : hobbyData.color,
            }}
            title={hobby}
            onMouseEnter={() => setHoveredHobby(index)}
            onMouseLeave={() => setHoveredHobby(null)}
          />
        );
      })}
    </div>
  );
};

export default UserHobbies;