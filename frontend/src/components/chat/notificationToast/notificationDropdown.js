import React, { useState, useEffect, useCallback } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { FaBell, FaImage, FaCommentAlt, FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ 
  notifications, 
  onNotificationsClear,
  onNotificationDelete 
}) => {
  const [unreadCount, setUnreadCount] = useState(notifications.length);
  const navigate = useNavigate();

  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  const handleDropdownToggle = (isOpen) => {
    if (isOpen) {
      onNotificationsClear();
      setUnreadCount(0);
    }
  };

  const getNotificationIcon = (notification) => {
    if (notification.message.includes('image')) return <FaImage />;
    return notification.message ? <FaCommentAlt /> : <FaBell />;
  };

  const handleNotificationClick = (notification) => {
    navigate('/chat', { 
      state: { 
        chatId: notification.chatId,
        targetUser: { id: notification.sender }
      } 
    });
  };

  const handleSingleNotificationDelete = useCallback((e, notificationId) => {
    e.stopPropagation(); // Prevent dropdown from closing
    onNotificationDelete(notificationId);
  }, [onNotificationDelete]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.round((now - date) / (1000 * 60));

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hr ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dropdown onToggle={handleDropdownToggle}>
      <Dropdown.Toggle 
        variant="link" 
        id="notification-dropdown"
        style={{
          color: 'rgba(255, 255, 255, 0.8)',
          position: 'relative',
          padding: '10px 16px',
        }}
      >
        <FaBell style={{ fontSize: '20px' }} />
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            pill 
            style={{
              position: 'absolute',
              top: '0',
              right: '5px',
              fontSize: '0.7em',
              padding: '3px 6px',
            }}
          >
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu 
        style={{
          maxHeight: '400px', 
          overflowY: 'auto',
          backgroundColor: 'rgba(30, 30, 50, 0.95)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          width: '350px',
        }}
      >
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '10px 15px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h6 style={{ margin: 0, fontWeight: 'bold' }}>Notifications</h6>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaTrash 
              onClick={onNotificationsClear} 
              style={{ 
                cursor: 'pointer', 
                color: 'rgba(255,255,255,0.6)',
                ':hover': { color: 'white' }
              }} 
              title="Clear all notifications"
            />
            <FaTimes 
              onClick={() => {}} // Close dropdown 
              style={{ 
                cursor: 'pointer', 
                color: 'rgba(255,255,255,0.6)',
                ':hover': { color: 'white' }
              }} 
              title="Close notifications"
            />
          </div>
        </div>

        {notifications.length === 0 ? (
          <Dropdown.Item 
            disabled 
            style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              textAlign: 'center' 
            }}
          >
            No new notifications
          </Dropdown.Item>
        ) : (
          notifications.map((notification) => (
            <Dropdown.Item 
              key={notification.id} 
              onClick={() => handleNotificationClick(notification)}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                backgroundColor: 'transparent',
                color: 'white',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                position: 'relative',
                ':hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <div 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  borderRadius: '50%', 
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {getNotificationIcon(notification)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>
                  {notification.senderUsername}
                </div>
                <div style={{ fontSize: '0.8em', opacity: 0.8 }}>
                  {notification.message}
                </div>
                <small style={{ 
                  display: 'block', 
                  marginTop: '3px', 
                  fontSize: '0.7em', 
                  opacity: 0.6 
                }}>
                  {formatTimestamp(notification.timestamp)}
                </small>
              </div>
              <FaTimes 
                onClick={(e) => handleSingleNotificationDelete(e, notification.id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  ':hover': { color: 'white' }
                }}
                title="Remove notification"
              />
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;