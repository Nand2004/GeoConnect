import React, { useState, useEffect } from 'react';
import axios from "axios";

import { Button, Card, Alert } from 'react-bootstrap';
import { MdOutlineGroup } from 'react-icons/md';
import {BsTrash } from 'react-icons/bs';


import { PlusIcon, UsersIcon, } from 'lucide-react';

// Utility function to generate avatar based on name
const generateAvatar = (name) => {
  const canvas = document.createElement('canvas');
  canvas.width = 50;
  canvas.height = 50;
  const context = canvas.getContext('2d');
  
  // Use a consistent background color based on the name
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  };
  
  const bgColor = `hsl(${Math.abs(hashCode(name)) % 360}, 70%, 60%)`;
  context.fillStyle = bgColor;
  context.fillRect(0, 0, 50, 50);
  
  // Add initials
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
  successMessage
}) {
  const [profileImages, setProfileImages] = useState({});

  // Fetch profile images for all unique users in chat history
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
          const response = await axios.get(`http://localhost:8081/user/getUserProfileImage/${currentUser.id}`);
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

  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column h-100">
        <div className="mb-3 d-flex gap-2">
          <Button
            variant="primary"
            className="w-50 d-flex align-items-center justify-content-center gap-2"
            onClick={() => {
              setChatMode("direct");
              setShowUserModal(true);
              setSelectedUsers([]);
              setSearch("");
            }}
          >
            <PlusIcon size={20} />
            New Chat
          </Button>
          <Button
            variant="outline-primary"
            className="w-50 d-flex align-items-center justify-content-center gap-2"
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

        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <div className="overflow-auto flex-grow-1">
          {chatHistory.slice().map((chat) => {
            // For direct chats, get the other participant's username
            const otherUsernames = chat.usernames.filter(username => username !== currentUser.username);
            const displayName = chat.chatType === "group" 
              ? chat.chatName 
              : otherUsernames.join(", ");
            
            // Get profile image or generate avatar
            const chatImage = chat.chatType === "group"
              ? generateAvatar(chat.chatName)
              : profileImages[otherUsernames[0]] || generateAvatar(displayName);

            return (
              <Card
                key={chat._id}
                className={`mb-2 cursor-pointer ${chatId === chat._id ? 'border-primary' : ''}`}
                onClick={() => handleChatSelect(chat)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center py-2">
                  <div className="d-flex align-items-center gap-2">
                    <img 
                      src={chatImage} 
                      alt="Chat avatar" 
                      className="rounded-circle me-2"
                      style={{ width: 40, height: 40, objectFit: 'cover' }}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2">
                      <span className="fw-medium">
                        {chat.chatType === "group" ? (
                          <>
                            {chat.chatName}
                            <MdOutlineGroup className="ms-2" />
                          </>
                        ) : (
                          chat.usernames.filter(username => username !== currentUser.username).join(", ")
                        )}
                      </span>
                      </div>
                      {unreadCounts[chat._id] > 0 && (
                        <span className="badge bg-primary">{unreadCounts[chat._id]} new</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="text-danger p-0"
                    onClick={e => handleDeleteChat(e, chat._id, chat)}
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