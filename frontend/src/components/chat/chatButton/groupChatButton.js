// GroupChatButton.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Loader2 } from 'lucide-react';

const GroupChatButton = ({ 
  currentUserId, 
  eventName, 
  attendees, 
  onSuccess, 
  onError 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initializeGroupChat = async () => {
    if (!currentUserId || !attendees.length || !eventName) {
      console.error('Missing required information:', { currentUserId, attendees, eventName });
      onError?.('Missing required information');
      return;
    }

    setIsLoading(true);
    try {
      // Check if group chat already exists
      const { data: existingChats } = await axios.get(
        `http://localhost:8081/chat/chatGetByUserId/${currentUserId}`
      );

      // Find if there's an existing group chat with this name
      const existingChat = existingChats.find(chat => 
        chat.chatType === 'group' && 
        chat.chatName === eventName
      );

      if (existingChat) {
        // If chat exists, navigate to it
        navigate('/chat', { 
          state: { 
            chatId: existingChat._id,
            isGroup: true,
            chatName: eventName
          }
        });
        onSuccess?.('Navigating to existing group chat');
        return;
      }

      // If no existing chat, create new group chat
      const userIds = [currentUserId, ...attendees.map(attendee => attendee.userId)];
      
      const response = await axios.post(
        "http://localhost:8081/chat/chatCreateChat",
        {
          chatType: "group",
          users: userIds,
          chatName: eventName
        }
      );

      if (response.data && response.data._id) {
        navigate('/chat', { 
          state: { 
            chatId: response.data._id,
            isGroup: true,
            chatName: eventName
          }
        });
        onSuccess?.('Group chat created successfully');
      }
    } catch (error) {
      console.error('Error initializing group chat:', error);
      onError?.(error.message || 'Failed to create group chat');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={initializeGroupChat}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <Users size={20} />
      )}
      <span>{isLoading ? 'Initializing...' : 'Event Chat'}</span>
    </button>
  );
};

export default GroupChatButton;