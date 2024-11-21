import React, { useState, useEffect } from 'react';
import { FaUsers, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import ChatButton from '../../chat/chatButton'; // Adjust the import path based on your file structure

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
  attendeeJoinDate: {
    fontSize: '0.9rem',
    color: '#6B7280',
  },
  chatButtonContainer: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
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
  },
  error: {
    textAlign: 'center',
    color: '#EF4444',
    padding: '20px',
    backgroundColor: '#FEE2E2',
    borderRadius: '8px',
    margin: '20px 0',
  },
  notification: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#4F46E5',
    color: '#fff',
    zIndex: 1100,
    animation: 'fadeOut 3s forwards',
  }
};

const avatarGradients = [
  'linear-gradient(135deg, #FF6B6B, #FFE66D)',
  'linear-gradient(135deg, #4F46E5, #06B6D4)',
  'linear-gradient(135deg, #10B981, #3B82F6)',
  'linear-gradient(135deg, #8B5CF6, #EC4899)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #06B6D4, #3B82F6)',
];

const AttendeesModal = ({ eventId, currentUserId, onClose }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:8081/event/getEvent/${eventId}`);
        setEventDetails(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load attendees. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const getAvatarGradient = (index) => {
    return avatarGradients[index % avatarGradients.length];
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleChatSuccess = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleChatError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  return (
    <div style={modalStyles.modalOverlay} onClick={onClose}>
      <div style={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <div style={modalStyles.title}>
            <FaUsers size={24} />
            <span>
              Event Attendees ({eventDetails?.attendees?.length || 0})
            </span>
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
          ) : error ? (
            <div style={modalStyles.error}>{error}</div>
          ) : eventDetails?.attendees?.length > 0 ? (
            eventDetails.attendees.map((attendee, index) => (
              <div key={attendee._id} style={modalStyles.attendeeItem}>
                <div 
                  style={{
                    ...modalStyles.attendeeAvatar,
                    background: getAvatarGradient(index),
                  }}
                >
                  {attendee.userId.username.charAt(0).toUpperCase()}
                </div>
                <div style={modalStyles.attendeeInfo}>
                  <div style={modalStyles.attendeeName}>
                    {attendee.userId.username}
                  </div>
                  <div style={modalStyles.attendeeJoinDate}>
                    Joined: {formatJoinDate(attendee.joinedAt)}
                  </div>
                </div>
                {attendee.userId._id !== currentUserId && (
                  <div style={modalStyles.chatButtonContainer}>
                    <ChatButton
                      targetUser={attendee.userId}
                      currentUserId={currentUserId}
                      onSuccess={handleChatSuccess}
                      onError={handleChatError}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={modalStyles.noAttendees}>
              No attendees yet
            </div>
          )}
        </div>
      </div>
      {notification && (
        <div style={modalStyles.notification}>
          {notification}
        </div>
      )}
    </div>
  );
};

export default AttendeesModal;