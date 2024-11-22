import React from 'react';
import { Toast } from 'react-bootstrap';

const NotificationToast = ({ 
  show, 
  onClose, 
  currentNotification 
}) => {
  return (
    <Toast
      show={show}
      onClose={onClose}
      delay={3000}
      autohide
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Toast.Header>
        <strong className="me-auto">
          Message from {currentNotification?.senderUsername}
        </strong>
        <small>
          {currentNotification?.timestamp &&
            new Date(currentNotification.timestamp).toLocaleTimeString()}
        </small>
      </Toast.Header>
      <Toast.Body>{currentNotification?.message}</Toast.Body>
    </Toast>
  );
};

export default NotificationToast;