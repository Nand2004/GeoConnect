// AttendeesModal.js
import React, { useState, useEffect } from 'react';
import { FaUsers, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const modalStyles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    position: 'relative',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '0 0 15px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#4F46E5',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#F3F4F6',
    }
  },
  attendeesList: {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '10px 0',
  },
  attendeeItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '10px',
    marginBottom: '12px',
    backgroundColor: '#F9FAFB',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    }
  },
  attendeeAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
    fontWeight: '600',
    fontSize: '1.25rem',
    color: '#fff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  attendeeUsername: {
    fontSize: '0.9rem',
    color: '#6B7280',
  },
  noAttendees: {
    textAlign: 'center',
    color: '#6B7280',
    padding: '32px',
    fontSize: '1.1rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
  },
  loadingState: {
    textAlign: 'center',
    padding: '20px',
    color: '#4F46E5',
  }
};

// Array of gradients for avatars
const avatarGradients = [
  'linear-gradient(135deg, #FF6B6B, #FFE66D)',
  'linear-gradient(135deg, #4F46E5, #06B6D4)',
  'linear-gradient(135deg, #10B981, #3B82F6)',
  'linear-gradient(135deg, #8B5CF6, #EC4899)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #06B6D4, #3B82F6)',
];

const AttendeesModal = ({ attendees, onClose }) => {
  const [attendeeDetails, setAttendeeDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendeeDetails = async () => {
      try {
        setLoading(true);
        // Fetch details for all attendees in parallel
        const details = await Promise.all(
          attendees.map(async (attendees) => {
            try {
              const response = await axios.get(`http://localhost:8081/user/getUserById/${attendees.userId}`);
              return response.data;
            } catch (error) {
              console.error(`Error fetching user ${attendees.userId}:`, error);
              return { username: 'Unknown User', _id: attendees.userId };
            }
          })
        );
        setAttendeeDetails(details);
      } catch (error) {
        console.error('Error fetching attendee details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (attendees && attendees.length > 0) {
      fetchAttendeeDetails();
    } else {
      setLoading(false);
    }
  }, [attendees]);

  const getAvatarGradient = (index) => {
    return avatarGradients[index % avatarGradients.length];
  };

  return (
    <div style={modalStyles.modalOverlay} onClick={onClose}>
      <div style={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <div style={modalStyles.title}>
            <FaUsers size={24} />
            <span>Event Attendees ({attendees.length})</span>
          </div>
          <button 
            style={modalStyles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div style={modalStyles.attendeesList}>
          {loading ? (
            <div style={modalStyles.loadingState}>
              Loading attendees...
            </div>
          ) : attendeeDetails.length > 0 ? (
            attendeeDetails.map((user, index) => (
              <div key={user._id} style={modalStyles.attendeeItem}>
                <div 
                  style={{
                    ...modalStyles.attendeeAvatar,
                    background: getAvatarGradient(index),
                  }}
                >
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={modalStyles.attendeeInfo}>
                  <div style={modalStyles.attendeeName}>
                    {user.username || 'Unknown User'}
                  </div>
                  {user.email && (
                    <div style={modalStyles.attendeeUsername}>
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={modalStyles.noAttendees}>
              No attendees yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeesModal;