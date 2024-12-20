import React, { useState, useEffect } from 'react';
import axios from "axios";

import { Button, Card, Alert } from 'react-bootstrap';
import { MdOutlineGroup } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import { PlusIcon, UsersIcon } from 'lucide-react';

const formatRelativeTime = (date) => {
  const now = new Date();
  const diffSeconds = (now - new Date(date)) / 1000;
  const diffMinutes = diffSeconds / 60;
  const diffHours = diffMinutes / 60;
  const diffDays = diffHours / 24;

  if (diffSeconds < 60) return 'now';
  if (diffMinutes < 60) return `${Math.floor(diffMinutes)}m`;
  if (diffHours < 24) return `${Math.floor(diffHours)}h`;
  if (diffDays < 7) return `${Math.floor(diffDays)}d`;
  
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

const generateAvatar = (name) => {
  const canvas = document.createElement('canvas');
  canvas.width = 50;
  canvas.height = 50;
  const context = canvas.getContext('2d');
  
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  };
  
  const bgColor = `hsl(${Math.abs(hashCode(name)) % 360}, 70%, 60%)`;
  context.fillStyle = bgColor;
  context.fillRect(0, 0, 50, 50);
  
  context.fillStyle = 'white';
  context.font = '20px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  context.fillText(initials, 25, 25);
  
  return canvas.toDataURL();
};

function ChatSidebar({
  chatHistory,
  currentUser,
  chatId,
  handleChatSelect,
  handleDeleteChat,
  setChatMode,
  setShowUserModal,
  setSelectedUsers,
  setSearch,
  unreadCounts,
  error,
  successMessage,
  setEnlargedImage
}) {
  const [profileImages, setProfileImages] = useState({});

  const sortedChatHistory = [...chatHistory].sort((a, b) => {
    const lastMessageA = a.messages.length > 0 
      ? new Date(a.messages[a.messages.length - 1].timestamp)
      : new Date(a.lastActivity);
    
    const lastMessageB = b.messages.length > 0 
      ? new Date(b.messages[b.messages.length - 1].timestamp)
      : new Date(b.lastActivity);
    
    return lastMessageB - lastMessageA;
  });

  useEffect(() => {
    const fetchProfileImages = async () => {
      const usernames = new Set();
      chatHistory.forEach(chat => {
        chat.usernames.forEach(username => {
          if (username !== currentUser.username) {
            usernames.add(username);
          }
        });
      });

      const images = {};
      for (const username of usernames) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/image/getUserProfileImage/${username}`);
          images[username] = response.data.profileImage || generateAvatar(username);
        } catch (error) {
          console.error(`Error fetching profile image for ${username}:`, error);
          images[username] = generateAvatar(username);
        }
      }

      setProfileImages(images);
    };

    fetchProfileImages();
  }, [chatHistory, currentUser]);

  const getLastMessageDetails = (chat) => {
    if (chat.messages.length === 0) return { text: "No messages", time: chat.lastActivity };
    
    const lastMessage = chat.messages[chat.messages.length - 1];
    return { 
      text: lastMessage.message || (lastMessage.attachments.length > 0 ? "Attachment" : ""), 
      time: lastMessage.timestamp 
    };
  };

  return (
    <Card 
      className="h-100 border-0" 
      style={{ 
        background: "linear-gradient(135deg, #0a0a19 0%, #1a1a4a 50%, #0a0a19 100%)",
        color: '#fff'
      }}
    >
      <Card.Body className="d-flex flex-column h-100 p-3">
        <div className="mb-3 d-flex gap-2">
          <Button
            variant="light"
            className="w-50 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
            onClick={() => {
              setChatMode("direct");
              setShowUserModal(true);
              setSelectedUsers([]);
              setSearch("");
            }}
          >
            <PlusIcon size={20} color="#1a1a4a" />
            New Chat
          </Button>
          <Button
            variant="outline-light"
            className="w-50 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
            onClick={() => {
              setChatMode("group");
              setShowUserModal(true);
              setSelectedUsers([]);
              setSearch("");
            }}
          >
            <UsersIcon size={20} />
            New Group
          </Button>
        </div>

        {error && <Alert variant="danger" className="mb-3 rounded-3">{error}</Alert>}
        {successMessage && <Alert variant="success" className="mb-3 rounded-3">{successMessage}</Alert>}

        <div className="overflow-auto flex-grow-1 pe-1">
          {sortedChatHistory.map((chat) => {
            const otherUsernames = chat.usernames.filter(username => username !== currentUser.username);
            const displayName = chat.chatType === "group" 
              ? chat.chatName 
              : otherUsernames.join(", ");
            
            const chatImage = chat.chatType === "group"
              ? generateAvatar(chat.chatName)
              : profileImages[otherUsernames[0]] || generateAvatar(displayName);

            const { text: lastMessageText, time: lastMessageTime } = getLastMessageDetails(chat);

            return (
              <Card
                key={chat._id}
                className={`mb-2 shadow-sm rounded-3 border-0 ${chatId === chat._id ? 'bg-light text-dark' : 'bg-dark text-light'}`}
                onClick={() => handleChatSelect(chat)}
                style={{ 
                  cursor: 'pointer', 
                  transition: 'transform 0.2s',
                  backgroundColor: chatId === chat._id ? '#fff' : 'rgba(255,255,255,0.1)'
                }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center py-3">
                  <div className="d-flex align-items-center gap-3 w-100">
                    <img 
                      src={chatImage} 
                      alt="Chat avatar" 
                      className="rounded-circle border border-light"
                      style={{ width: 45, height: 45, objectFit: 'cover' }}
                      onClick={() => setEnlargedImage(chatImage)}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <span className={`fw-bold ${chatId === chat._id ? 'text-dark' : 'text-light'}`}>
                            {chat.chatType === "group" ? (
                              <>
                                {chat.chatName}
                                <MdOutlineGroup className={`ms-2 ${chatId === chat._id ? 'text-muted' : 'text-light'}`} />
                              </>
                            ) : (
                              chat.usernames.filter(username => username !== currentUser.username).join(", ")
                            )}
                          </span>
                        </div>
                        <small className={chatId === chat._id ? 'text-muted' : 'text-light-50'}>
                          {formatRelativeTime(lastMessageTime)}
                        </small>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className={`d-block text-truncate ${chatId === chat._id ? 'text-muted' : 'text-light-50'}`} style={{ maxWidth: '200px' }}>
                            {lastMessageText}
                          </small>
                          {unreadCounts[chat._id] > 0 && (
                            <span className={`badge ${chatId === chat._id ? 'bg-primary' : 'bg-light text-primary'} rounded-pill mt-1`}>
                              {unreadCounts[chat._id]} new
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className={`p-0 ms-2 ${chatId === chat._id ? 'text-danger' : 'text-light-50'}`}
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteChat(e, chat._id, chat);
                    }}
                  >
                    <BsTrash size={18} />
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ChatSidebar;