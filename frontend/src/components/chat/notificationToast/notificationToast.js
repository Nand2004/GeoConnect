import React from 'react';
import { FaBell, FaImage, FaCommentAlt, FaUser } from 'react-icons/fa';

// Desktop Notification Utility
const requestNotificationPermission = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
      }
    });
  }
};

const showDesktopNotification = (notification) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const getNotificationIcon = () => {
    const icons = {
      image: '📸',
      message: '💬',
      default: '🔔'
    };

    if (notification.message.includes('image')) return icons.image;
    return notification.message ? icons.message : icons.default;
  };

  new Notification(`New message from ${notification.senderUsername}`, {
    body: notification.message,
    icon: getNotificationIcon(),
    vibrate: [200, 100, 200],
    silent: false,
    requireInteraction: false
  });
};

const NotificationToast = ({ 
  show, 
  onClose, 
  currentNotification,
  setCurrentNotification,
}) => {
  // Request notification permission on component mount
  React.useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Trigger desktop notification when new notification arrives
  React.useEffect(() => {
    if (currentNotification) {
      showDesktopNotification(currentNotification);
    }
  }, [currentNotification]);

  const getNotificationIcon = () => {
    if (currentNotification?.message.includes('image')) return <FaImage />;
    return currentNotification?.message ? <FaCommentAlt /> : <FaBell />;
  };

  setTimeout(() => {
    setCurrentNotification('');
  }, 3000);

  if (!show || !currentNotification) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        backgroundColor: 'rgba(51, 51, 51, 0.9)',
        borderRadius: '12px',
        color: 'white',
        padding: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '300px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '60px',
      }}
    >
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.2)', 
        borderRadius: '50%', 
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {getNotificationIcon()}
      </div>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          <FaUser style={{ marginRight: '5px' }} />
          {currentNotification.senderUsername}
        </div>
        <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
          {currentNotification.message}
        </div>
        <small style={{ 
          display: 'block', 
          marginTop: '5px', 
          fontSize: '0.7em', 
          opacity: 0.6 
        }}>
          {new Date(currentNotification.timestamp).toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
};

export default NotificationToast;