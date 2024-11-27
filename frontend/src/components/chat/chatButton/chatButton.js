// ChatButton.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Loader2 } from 'lucide-react';

const ChatButton = ({ targetUser, currentUserId, onSuccess, onError }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initializeChat = async () => {
    if (!currentUserId || !targetUser._id) {
      console.error('Missing user information:', { currentUserId, targetUser });
      onError?.('Missing user information');
      return;
    }

    setIsLoading(true);
    try {
      // Check if chat already exists
      const { data: existingChats } = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/chat/chatGetByUserId/${currentUserId}`
      );

      // Find if there's an existing direct chat between these users
      const existingChat = existingChats.find(chat => 
        chat.chatType === 'direct' && 
        chat.users.some(user => user.userId === targetUser._id)
      );

      if (existingChat) {
        // If chat exists, navigate to it
        navigate('/chat', { 
          state: { 
            chatId: existingChat._id,
            targetUser: targetUser 
          }
        });
        onSuccess?.('Navigating to existing chat');
        return;
      }

      // If no existing chat, create new one
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/chat/chatCreateChat`,
        {
          chatType: "direct",
          users: [currentUserId, targetUser._id]
        }
      );

      if (response.data && response.data._id) {
        navigate('/chat', { 
          state: { 
            chatId: response.data._id,
            targetUser: targetUser
          }
        });
        onSuccess?.('Chat created successfully');
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      onError?.(error.message || 'Failed to initialize chat');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={initializeChat}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-20  "
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <MessageCircle size={20} />
      )}
      <span>{isLoading ? 'Initializing...' : 'Chat'}</span>
    </button>
  );
};

export default ChatButton;