import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { io } from 'socket.io-client';
import getUserInfo from '../../utilities/decodeJwt';
import './chat.css'; 

function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null); 

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) setCurrentUser(userInfo);
  }, []);

  useEffect(() => {
    const newSocket = io('http://localhost:8081');
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const handleSearch = async () => {
    if (!search) return;
    try {
      const { data } = await axios.get(`http://localhost:8081/user/userSearchUser?username=${search}`);
      setSearchResults(data);
      setError('');
    } catch {
      setError('Error searching for users.');
    }
  };

  const handleCreateChat = async (selectedUser) => {
    if (!currentUser) return;

    try {
      const body = {
        chatType: 'direct',
        users: [currentUser.id, selectedUser._id],
      };

      const response = await axios.post('http://localhost:8081/chat/chatCreateChat', body);

      if (response.data && response.data._id) {
        const chatId = response.data._id;
        setChatId(chatId);
        setSuccessMessage(`Chat created with ${selectedUser.username}`);
        setSearchResults([]);
        setSelectedUser(selectedUser);
        await loadMessages(chatId);
      } else {
        setError('Chat creation failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('Error creating chat.');
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:8081/chat/chatGetByChatId/${chatId}`);
      if (response.data && response.data.messages) {
        const loadedMessages = response.data.messages.map((msg) => ({
          userId: msg.sender,
          message: msg.message,
          timestamp: msg.timestamp,
        }));
        setMessages(loadedMessages);
      } else {
        setError('No messages found.');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Error loading messages.');
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || !chatId) return;
    try {
      const response = await axios.post(`http://localhost:8081/chat/chatSendMessage/${chatId}`, {
        sender: currentUser.id,
        message: message,
      });

      if (response.data) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            userId: currentUser.id,
            message: message,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message.');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setMessages((prev) => [
          ...prev,
          { sender: message.sender, text: message.message, time: new Date().toLocaleTimeString() },
        ]);
      });
    }
  }, [socket]);

  return (
    <div className="app">
      <div className="d-flex flex-column sidebar">
        <input
          type="text"
          className="form-control searchBar"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="primary" onClick={handleSearch}>Search</Button>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <ul className="list-unstyled userList">
          {searchResults.map(user => (
            <li
              key={user._id}
              onClick={() => handleCreateChat(user)}
              className="d-flex align-items-center justify-content-between userItem"
            >
              <span>{user.username}</span>
              <Button variant="primary">Start Chat</Button>
            </li>
          ))}
        </ul>
      </div>
  
      {selectedUser && (
        <div className="d-flex flex-column chatWindow">
          <h2 className="chatHeader">Chat with {selectedUser.username}</h2>
          <div className="flex-grow-1 d-flex flex-column chatMessages">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`messageBubble ${msg.userId === currentUser.id ? 'myMessage' : 'otherMessage'}`}
                >
                  <span className="messageText">{msg.message}</span>
                  <span className="messageTime">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <div>No messages yet.</div>
            )}
          </div>
          <form
            className="messageInput"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(e.target.message.value);
              e.target.message.value = '';
            }}
          >
            <input
              type="text"
              name="message"
              className="form-control inputField"
              placeholder="Send a message..."
            />
            <button type="submit" className="btn btn-primary sendButton">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
