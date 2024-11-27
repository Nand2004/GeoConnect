import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Loader2, MessageCircle } from 'lucide-react';

const EventChatButton = ({ 
  currentUserId, 
  eventId,
  eventName, 
  attendees, 
  chatType = 'group', // Default to group, option for direct
  onSuccess, 
  onError 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initializeEventChat = async () => {
    if (!currentUserId || !eventId) {
      console.error('Missing required information:', { currentUserId, eventId });
      onError?.('Missing required information');
      return;
    }

    setIsLoading(true);
    try {
      // Fetch existing chats for the current user
      const { data: existingChats } = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/chat/chatGetByUserId/${currentUserId}`
      );

      // Find existing chat based on chat type and event
      const existingChat = existingChats.find(chat => 
        chat.chatType === chatType && 
        chat.event && 
        chat.event.toString() === eventId &&
        (chatType === 'group' || 
         chat.users.some(u => u.userId === currentUserId))
      );

      if (existingChat) {
        navigate('/chat', { 
          state: { 
            chatId: existingChat._id,
            isGroup: chatType === 'group',
            chatName: eventName
          }
        });
        onSuccess?.(`Navigating to existing ${chatType} chat`);
        return;
      }

      // Prepare users for the chat
      const userIds = chatType === 'group'
        ? [currentUserId, ...attendees.map(attendee => attendee.userId)]
        : [currentUserId, attendees[0].userId];

      // Create new chat
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/chat/chatCreateChat`,
        {
          chatType,
          users: userIds.map(userId => ({ 
            userId, 
            role: userId === currentUserId ? 'admin' : 'member' 
          })),
          chatName: chatType === 'group' ? eventName : '',
          event: eventId
        }
      );

      if (response.data && response.data._id) {
        navigate('/chat', { 
          state: { 
            chatId: response.data._id,
            isGroup: chatType === 'group',
            chatName: eventName
          }
        });
        onSuccess?.(`${chatType} chat created successfully`);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      onError?.(error.message || `Failed to create ${chatType} chat`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={initializeEventChat}
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

export default EventChatButton;