import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { io } from 'socket.io-client';
import getUserInfo from '../../utilities/decodeJwt';

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

  // Fetch user info on component mount
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setCurrentUser(userInfo);
    }
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io('http://localhost:8081'); // Replace with your server address if necessary
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Search for users based on input
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

  // Create chat between current user and selected user
  const handleCreateChat = async (selectedUser) => {
    if (!currentUser) return;

    try {
      // Prepare the body with user IDs for the API call
      const body = {
        chatType: 'direct', // Assuming the chat type is always direct for two users
        users: [currentUser.id, selectedUser._id],
      };

      // Make the POST request to create the chat
      const response = await axios.post('http://localhost:8081/chat/chatCreateChat', body);

      // Check if the response is successful and contains the chat ID
      if (response.data && response.data._id) {
        const chatId = response.data._id; // Save the chat ID

        setChatId(chatId);
        setSuccessMessage(`Chat created with ${selectedUser.username}`);
        setSearchResults([]);
        setSelectedUser(selectedUser); // Store the selected user object

        // Load messages for the newly created chat using the chatId
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
      
      // Check if the response contains messages
      if (response.data && response.data.messages) {
        // Set messages from the response
        const loadedMessages = response.data.messages.map((msg) => ({
          userId: msg.sender,  // Use the sender ID
          message: msg.message,
          timestamp: msg.timestamp
        }));
        setMessages(loadedMessages); // Update your messages state
      } else {
        setError('No messages found.');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Error loading messages.');
    }
  };
  


  const handleSendMessage = async (message) => {
    if (!message.trim() || !chatId) return; // Don't send empty messages or if chatId is not set
  
    try {
      const response = await axios.post(`http://localhost:8081/chat/chatSendMessage/${chatId}`, {
        sender: currentUser.id, // Use the ID of the current user
        message: message,
        // Attachments can be included here if needed
      });
  
      if (response.data) {
        // Optionally, update messages or perform any additional action after sending
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            userId: currentUser.id, // Adding the sent message to the local state
            message: message,
            timestamp: new Date().toISOString(), // Use current time for the new message
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
  

  // Listen for incoming messages in real-time
  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setMessages((prev) => [...prev, { sender: message.sender, text: message.message, time: new Date().toLocaleTimeString() }]);
      });
    }
  }, [socket]);

  return (
    <div style={styles.app}>
      <div className="d-flex flex-column" style={styles.sidebar}>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchBar}
        />
        <Button variant="primary" onClick={handleSearch}>Search</Button>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <ul className="list-unstyled" style={styles.userList}>
          {searchResults.map(user => (
            <li
              key={user._id}
              onClick={() => handleCreateChat(user)} // Pass user object to create chat
              style={styles.userItem}
              className="d-flex align-items-center justify-content-between"
            >
              <span>{user.username}</span> {/* Display username */}
              <Button variant="primary">Start Chat</Button>
            </li>
          ))}
        </ul>
      </div>
  
      {selectedUser && (
        <div className="d-flex flex-column" style={styles.chatWindow}>
          <h2 style={styles.chatHeader}>Chat with {selectedUser.username}</h2> {/* Show username in chat header */}
          <div className="flex-grow-1 d-flex flex-column" style={styles.chatMessages}>
            {/* Render the messages here */}
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className={msg.userId === currentUser.id ? 'my-message' : 'other-message'} 
                style={{
                  ...styles.messageBubble,
                  ...(msg.userId === currentUser.id ? styles.myMessage : styles.otherMessage),
                  marginLeft: msg.userId === currentUser.id ? 'auto' : '0', // Align sent messages to the right

                }}>
                  <span style={styles.messageText}>{msg.message}</span>
                  <span style={styles.messageTime}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <div>No messages yet.</div> // Display a message if there are no messages
            )}
          </div>
          <form
            style={styles.messageInput}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(e.target.message.value); // Call the function on form submit
              e.target.message.value = ''; // Clear the input after sending
            }}
          >
            <input
              type="text"
              name="message"
              className="form-control"
              style={styles.inputField}
              placeholder="Send a message..."
            />
            <button type="submit" className="btn btn-primary" style={styles.sendButton}>Send</button>
          </form>
        </div>
      )}
    </div>
  );  
}

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    background: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '25%',
    backgroundColor: '#2C3E50',
    padding: '20px',
    borderRight: '1px solid #ccc',
  },
  searchBar: {
    marginBottom: '20px',
    borderRadius: '20px',
    padding: '10px',
    backgroundColor: '#34495E',
    color: 'white',
    border: 'none',
    transition: 'background-color 0.3s',
    outline: 'none',
  },
  userList: {
    margin: 0,
    padding: 0,
    maxHeight: '80vh',
    overflowY: 'scroll',
  },
  userItem: {
    padding: '12px 15px',
    borderBottom: '1px solid #555',
    cursor: 'pointer',
    color: '#ecf0f1',
    transition: 'background-color 0.3s',
  },
  userItemHover: {
    backgroundColor: '#34495E',
  },
  chatWindow: {
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#212F3D',
    padding: '25px',
  },
  chatHeader: {
    marginBottom: '15px',
    fontSize: '1.5em',
    color: '#ecf0f1',
  },
  chatMessages: {
    flexGrow: 1,
    padding: '10px',
    overflowY: 'auto',
    maxHeight: '900px', // Remove max height constraint
  },
  messageBubble: {
    borderRadius: '10px',
    padding: '8px',
    margin: '10px 0', // Change margin here to increase space between messages
    maxWidth: '60%',
  },  
  myMessage: {
    textAlign: 'right',
    backgroundColor: '#d1ffd1', // Light green for sent messages
  },
  otherMessage: {
    textAlign: 'left',
    backgroundColor: '#f0f0f0', // Light gray for received messages
  },
  messageText: {
    color: '#000', // Black text for readability
  },
  messageTime: {
    fontSize: '0.8em',
    color: 'gray',
    marginLeft: '5px',
  },
  messageInput: {
    display: 'flex',
    paddingTop: '10px',
  },
  inputField: {
    flexGrow: 1,
    marginRight: '10px',
    borderRadius: '20px',
    padding: '10px',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#00B74A',
    color: 'white',
    borderRadius: '25px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }
};

export default Chat;
