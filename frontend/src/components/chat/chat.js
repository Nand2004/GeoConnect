import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Alert, Toast } from "react-bootstrap";
import axios from "axios";
import { io } from "socket.io-client";
import getUserInfo from "../../utilities/decodeJwt";
import "./chat.css";

function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]); // New state for chat history
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({}); // Track unread messages per chat

  

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) setCurrentUser(userInfo);
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:8081");
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (currentUser) {
        try {
          const { data } = await axios.get(
            `http://localhost:8081/chat/chatGetByUserId/${currentUser.id}`
          );
          // Assuming data is an array of chat objects
          const chatWithUsernames = await Promise.all(
            data.map(async (chat) => {
              const usernames = await Promise.all(
                chat.users.map(async (user) => {
                  const response = await axios.get(`http://localhost:8081/user/getUsernameByUserId/${user.userId}`);
                  return response.data.username;
                })
              );
              return { ...chat, usernames }; // Add usernames to the chat object
            })
          );
          setChatHistory(chatWithUsernames);
        } catch (error) {
          console.error("Error fetching chat history:", error);
          setError("Error fetching chat history.");
        }
      }
    };
    fetchChatHistory();
  }, [currentUser]);

  const handleSearch = async () => {
    if (!search) return;
    try {
      const { data } = await axios.get(
        `http://localhost:8081/user/userSearchUser?username=${search}`
      );
      setSearchResults(data);
      setError("");
    } catch {
      setError("Error searching for users.");
    }
  };

  const handleCreateChat = async (selectedUser) => {
    if (!currentUser) return;

    try {
      const body = {
        chatType: "direct",
        users: [currentUser.id, selectedUser._id],
      };

      const response = await axios.post(
        "http://localhost:8081/chat/chatCreateChat",
        body
      );

      if (response.data && response.data._id) {
        const chatId = response.data._id;
        setChatId(chatId);
        setSuccessMessage(`Chat created with ${selectedUser.username}`);
        setSearchResults([]);
        setSelectedUser(selectedUser);
        await loadMessages(chatId);
      } else {
        setError("Chat creation failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("Error creating chat.");
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/chat/chatGetByChatId/${chatId}`
      );
      if (response.data && response.data.messages) {
        const loadedMessages = response.data.messages.map((msg) => ({
          userId: msg.sender,
          message: msg.message,
          timestamp: msg.timestamp,
        }));
        setMessages(loadedMessages);
      } else {
        setError("No messages found.");
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Error loading messages.");
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || !chatId) return;
  
    // Immediately add the message to the messages state
    const newMessage = {
      userId: currentUser.id,
      message: message,
      timestamp: new Date().toISOString(),
    };
  
    // Update the state immediately to reflect the sent message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  
    try {
      const response = await axios.post(
        `http://localhost:8081/chat/chatSendMessage/${chatId}`,
        {
          sender: currentUser.id,
          message: message,
        }
      );
  
      if (response.data) {
        // Emit the message through the socket
        socket.emit("sendingMessage", {
          chatId,
          sender: currentUser.id,
          message,
        });
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Error sending message.");
    }
    console.log("sent message: ", message);
  };
    

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8081/chat/deleteChat/${chatId}`);
      setChatHistory(prev => prev.filter(chat => chat._id !== chatId));
      if (chatId === currentUser?.id) {
        setSelectedUser(null);
        setMessages([]);
        setChatId(null);
      }
      setSuccessMessage("Chat deleted successfully");
    } catch (error) {
      console.error("Error deleting chat:", error);
      setError("Error deleting chat");
    }
    setTimeout(() => {
      setSuccessMessage("");
      setError("");
    }, 3000);
  };



  useEffect(() => {
    if (socket) {
      const handleMessage = async (message) => {
        console.log("Listening Message:", message);
        
        if (message.chatId === chatId && message.sender !== currentUser.id) {
          // Update messages for current chat
          setMessages((prev) => [
            ...prev,
            {
              userId: message.sender,
              message: message.message,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
        // Only show notification if the message is for the current user
        else if (message.sender !== currentUser?.id) {
          try {
            // Fetch sender's username
            const response = await axios.get(
              `http://localhost:8081/user/getUsernameByUserId/${message.sender}`
            );
            const senderUsername = response.data.username;

            // Check if the current user is part of this chat
            const chatResponse = await axios.get(
              `http://localhost:8081/chat/chatGetByChatId/${message.chatId}`
            );
            
            const isUserInChat = chatResponse.data.users.some(
              user => user.userId === currentUser.id
            );

            if (isUserInChat) {
              // Update unread count for the chat
              setUnreadCounts(prev => ({
                ...prev,
                [message.chatId]: (prev[message.chatId] || 0) + 1
              }));

              // Show toast notification
              const notification = {
                id: Date.now(),
                message: message.message,
                sender: message.sender,
                senderUsername: senderUsername,
                chatId: message.chatId,
                timestamp: new Date().toISOString()
              };
              
              setNotifications(prev => [...prev, notification]);
              setCurrentNotification(notification);
              setShowToast(true);
            }
          } catch (error) {
            console.error("Error fetching sender info:", error);
          }
        }
      };
  
      socket.on("listeningMessage", handleMessage);
  
      return () => {
        socket.off("listeningMessage", handleMessage);
      };
    }
  }, [socket, chatId, currentUser]);
  
  
  
  const NotificationToast = () => (
    <Toast className="toast-style" 
      onClose={() => setShowToast(false)}
      show={showToast}
      delay={3000}
      autohide
    >
      <Toast.Header>
        <strong className="me-auto">Message from {currentNotification?.senderUsername}</strong>
        <small>{new Date(currentNotification?.timestamp).toLocaleTimeString()}</small>
      </Toast.Header>
      <Toast.Body>
        {currentNotification?.message}
      </Toast.Body>
    </Toast>
  );

// Update your handleChatSelect function
const handleChatSelect = async (chat) => {
  setSelectedUser(chat.users.find((user) => user.userId !== currentUser.id));
  setChatId(chat._id);
  // Clear unread count when selecting a chat
  setUnreadCounts(prev => ({
    ...prev,
    [chat._id]: 0
  }));
  await loadMessages(chat._id);
};

  useEffect(() => {
    const interval = setInterval(() => {
      if (chatId) {
        loadMessages(chatId); // Optionally refresh messages every few seconds
      }
    }, 5000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [chatId]);

  return (
    <div className="app" style = {{paddingTop: '60px'}}>

      <NotificationToast />

      <div className="d-flex flex-column sidebar">
        <input
          type="text"
          className="form-control searchBar"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        {/* Display chat history */}
        <ul className="list-unstyled userList">
        {chatHistory.slice().reverse().map((chat) => (
          <li
            key={chat._id}
            onClick={() => handleChatSelect(chat)}
            className="chat-item"
          >
            <div className="chat-info">
              <span className={`chat-name ${unreadCounts[chat._id] ? 'fw-bold' : ''}`}>
                {chat.usernames.filter(username => username !== currentUser.username).join(", ")}
              </span>
              {unreadCounts[chat._id] > 0 && (
                <>
                  {unreadCounts[chat._id] === 1 ? (
                    <span className="unread-indicator" />
                  ) : (
                    <span className="unread-count">
                      {unreadCounts[chat._id]}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={e => e.stopPropagation()}>Open</Button>
              <Button variant="danger" onClick={e => handleDeleteChat(e, chat._id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>


        {/* Display search results */}
        <ul className="list-unstyled userList">
          {searchResults.map((user) => (
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
                  className={`messageBubble ${msg.userId === currentUser.id ? "myMessage" : "otherMessage"
                    }`}
                >
                  <span className="messageText">{msg.message}</span>
                  <span className="messageTime">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
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
              e.target.message.value = "";
            }}
          >
            <input
              type="text"
              name="message"
              className="form-control inputField"
              placeholder="Send a message..."
            />
            <button type="submit" className="btn btn-primary sendButton">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
