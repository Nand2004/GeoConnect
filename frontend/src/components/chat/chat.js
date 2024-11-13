import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Alert, Toast, Card } from "react-bootstrap";
import axios from "axios";
import { io } from "socket.io-client";
import getUserInfo from "../../utilities/decodeJwt";
import "./chat.css";
import UserSelectionModal from "./userSelectionModal"; // Import the modal
import { MdOutlineGroup } from "react-icons/md";
import { BsSend, BsPlus, BsPeople, BsTrash, BsImage } from "react-icons/bs";
import { useLocation } from 'react-router-dom';

function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");// eslint-disable-next-line
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null);// eslint-disable-next-line
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(null); //State to store selectedImage.
  const [showUserModal, setShowUserModal] = useState(false); //UserModal State
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [chatMode, setChatMode] = useState("direct");

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) setCurrentUser(userInfo);
  }, []);

  useEffect(() => {
    // If a specific chatId was passed through navigation
    if (location.state?.chatId) {
      setChatId(location.state.chatId);
      if (location.state.targetUser) {
        setSelectedUser(location.state.targetUser);
      }
      loadMessages(location.state.chatId);
    }
  }, [location.state]);

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
          const chatWithUsernames = await Promise.all(
            data.map(async (chat) => {
              const usernames = await Promise.all(
                chat.users.map(async (user) => {
                  const response = await axios.get(`http://localhost:8081/user/getUsernameByUserId/${user.userId}`);
                  return response.data.username;
                })
              );
              return { ...chat, usernames };
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

  //Image functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (file && file.size > MAX_SIZE) {
      setError('Image size must be less than 5MB');
      return;
    }

    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgPreview = event.target.result;
        const previewElement = document.getElementById('imagePreview');
        if (previewElement) {
          previewElement.src = imgPreview;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    if (document.getElementById('imagePreview')) {
      document.getElementById('imagePreview').src = '';
    }
  };


  const handleSearch = async () => {
    if (!search) {
      setSearchResults([]);
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:8081/user/userSearchUser?username=${search}`
      );
      const filteredResults = data.filter(user => user._id !== currentUser.id);
      setSearchResults(filteredResults);
      setError("");
    } catch {
      setError("Error searching for users.");
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.some(selected => selected._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(selected => selected._id !== user._id));
    } else {
      if (chatMode === "direct") {
        setSelectedUsers([user]); // Only one user for direct chat
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    }
  };

  const handleCreateChat = async () => {
    if (!currentUser || !selectedUsers.length) return;

    try {
      const userIds = [currentUser.id, ...selectedUsers.map(user => user._id)];
      const isGroup = chatMode === "group" && selectedUsers.length > 1;

      const body = {
        chatType: isGroup ? "group" : "direct",
        users: userIds,
        ...(isGroup && { chatName: groupName }) // Store the group name as chatName in the request body
      };

      const response = await axios.post(
        "http://localhost:8081/chat/chatCreateChat",
        body
      );

      if (response.data && response.data._id) {
        const chatId = response.data._id;
        setChatId(chatId);
        setSuccessMessage(
          isGroup
            ? `Group chat "${groupName}" created`
            : `Chat created with ${selectedUsers[0].username}`
        );
        setSearchResults([]);
        setSelectedUser(isGroup ? null : selectedUsers[0]);
        setShowUserModal(false);
        setSelectedUsers([]);
        setGroupName(""); // Reset group name field
        await loadMessages(chatId);
      } else {
        setError("Chat creation failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("Error creating chat.");
    }
    setTimeout(() => {
      setSuccessMessage("");
      setError("");
    }, 3000);
  };

  const loadMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/chat/chatGetByChatId/${chatId}`
      );
      if (response.data && response.data.messages) {
        const loadedMessages = response.data.messages.map((msg) => ({
          userId: msg.sender,
          message: msg.message || '',
          timestamp: msg.timestamp,
          attachments: msg.attachments ? msg.attachments.map(attachment => ({
            type: attachment,
            name: attachment.split('/').pop(), // Extract filename from URL
            mimeType: attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image/' + attachment.split('.').pop().toLowerCase() : 'application/octet-stream'
          })) : []
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

  const handleSendMessage = async (message, selectedImage = null) => {
    try {
      // Input validation with better error handling
      if (!chatId || !currentUser?.id) {
        setError('Chat session not found');
        return;
      }

      if (!message?.trim() && !selectedImage) {
        setError('Please provide a message or image');
        return;
      }

      // Prepare base message object
      const newMessage = {
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        message: message?.trim() || '',
        attachments: []
      };

      // Handle image upload if present
      let uploadedImageUri = null;
      if (selectedImage) {
        try {
          const formData = new FormData();
          formData.append('image', selectedImage);
          formData.append('name', `${currentUser.id}_${Date.now()}`);

          const imageResponse = await axios.post(
            'http://localhost:8081/image/createImage',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          if (imageResponse.data && imageResponse.data.imageUri) {
            uploadedImageUri = imageResponse.data.imageUri;
            newMessage.attachments = [{
              type: uploadedImageUri,
              name: selectedImage.name,
              mimeType: selectedImage.type
            }];
          }
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          setError('Failed to upload image. Please try again.');
          return;
        }
      }

      // Send message to backend
      const messageResponse = await axios.post(
        `http://localhost:8081/chat/chatSendMessage/${chatId}`,
        {
          sender: currentUser.id,
          message: newMessage.message,
          attachments: uploadedImageUri ? [uploadedImageUri] : []
        }
      );

      if (messageResponse.data) {
        // Update local messages state
        setMessages(prevMessages => [...prevMessages, newMessage]);

        // Emit socket event
        if (socket) {
          socket.emit('sendingMessage', {
            chatId,
            sender: currentUser.id,
            message: newMessage.message,
            attachments: newMessage.attachments
          });
        }

        // Clear image preview and selection
        if (selectedImage) {
          setSelectedImage(null);
          const previewElement = document.getElementById('imagePreview');
          if (previewElement) {
            previewElement.src = '';
          }
        }
        return true; // Indicate successful message send
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setError(error.message || 'Error sending message. Please try again.');
      return false; // Indicate failed message send
    }
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

  const handleChatSelect = async (chat) => {
    setSelectedUser(chat.users.find((user) => user.userId !== currentUser.id));
    setChatId(chat._id);
    setUnreadCounts(prev => ({
      ...prev,
      [chat._id]: 0
    }));
    await loadMessages(chat._id);
  };

  useEffect(() => {
    if (socket) {
      const handleMessage = async (message) => {
        console.log("Listening Message:", message);

        if (message.chatId === chatId && message.sender !== currentUser.id) {
          setMessages((prev) => [
            ...prev,
            {
              userId: message.sender,
              message: message.message,
              attachments: message.attachments || [],
              timestamp: new Date().toISOString(),
            },
          ]);
        } else if (message.sender !== currentUser?.id) {
          try {
            const response = await axios.get(
              `http://localhost:8081/user/getUsernameByUserId/${message.sender}`
            );
            const senderUsername = response.data.username;

            const chatResponse = await axios.get(
              `http://localhost:8081/chat/chatGetByChatId/${message.chatId}`
            );

            const isUserInChat = chatResponse.data.users.some(
              user => user.userId === currentUser.id
            );

            if (isUserInChat) {
              setUnreadCounts(prev => ({
                ...prev,
                [message.chatId]: (prev[message.chatId] || 0) + 1
              }));

              const notification = {
                id: Date.now(),
                message: message.attachments?.length ? '📎 Sent an image' : message.message,
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
    <Toast
      className="toast-style"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value;

    try {
      const success = await handleSendMessage(messageText, selectedImage);
      if (success) {
        e.target.message.value = "";
        setSelectedImage(null);
        const previewElement = document.getElementById('imagePreview');
        if (previewElement) {
          previewElement.src = '';
        }
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError('Failed to send message');
    }
  };

  return (
    <div className="vh-100 pt-4" style={{ paddingTop: '60px', overflowY: 'auto' }}>
      <div className="container-fluid h-100" style={{ height: '60vh', overflow: 'hidden', paddingTop: '55px', background: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)" }}>
        <div className="row h-100">
          {/* Sidebar */}
          <div className="col-md-4 col-lg-3 h-100">
            <Card className="h-100">
              <NotificationToast />

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
                    <BsPlus size={20} />
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
                      setGroupName("");
                    }}
                  >
                    <BsPeople size={20} />
                    New Group
                  </Button>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <div className="overflow-auto flex-grow-1">
                  {chatHistory.slice().reverse().map((chat) => (
                    <Card
                      key={chat._id}
                      className={`mb-2 cursor-pointer ${chatId === chat._id ? 'border-primary' : ''}`}
                      onClick={() => handleChatSelect(chat)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Body className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center gap-2">
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
                          onClick={e => handleDeleteChat(e, chat._id)}
                        >
                          <BsTrash size={18} />
                        </Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="col-md-8 col-lg-9 h-100">
            <Card className="h-100">
              {chatId ? (
                <>
                  <Card.Header>
                    <h5 className="mb-0 d-flex align-items-center gap-2">
                      {chatHistory.find((chat) => chat._id === chatId)?.chatType === "group" ? (
                        <>
                          {chatHistory.find((chat) => chat._id === chatId)?.chatName || "Unnamed Group"}
                          <MdOutlineGroup />
                        </>
                      ) : (
                        chatHistory
                          .find((chat) => chat._id === chatId)
                          ?.usernames.filter((username) => username !== currentUser.username)
                          .join(", ")
                      )}
                    </h5>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column" style={{ height: 'calc(100% - 160px)' }}>
                    <div className="overflow-auto flex-grow-1">
                      {messages.length > 0 ? (
                        messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`d-flex mb-3 ${msg.userId === currentUser.id ? 'justify-content-end' : 'justify-content-start'}`}
                          >
                            <div
                              className={`p-3 rounded-3 ${msg.userId === currentUser.id ? 'bg-primary text-white' : 'bg-light'}`}
                              style={{ maxWidth: '70%' }}
                            >
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="d-flex flex-column gap-2 mb-2">
                                  {msg.attachments.map((attachment, idx) => (
                                    <div key={idx}>
                                      <img
                                        src={attachment.type}
                                        alt={attachment.name}
                                        className="rounded img-fluid"
                                        style={{ maxHeight: '200px' }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {msg.message && <div className="message-text">{msg.message}</div>}
                              <small className={msg.userId === currentUser.id ? 'text-white-50' : 'text-muted'}>
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </small>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted">No messages yet.</div>
                      )}                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="outline-secondary"
                          className="position-relative p-2"
                          style={{ width: '40px', height: '40px' }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="position-absolute top-0 start-0 opacity-0 w-100 h-100"
                            style={{ cursor: 'pointer' }}
                          />
                          <BsImage />
                        </Button>
                        {selectedImage && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={clearImageSelection}
                          >
                            Clear Image
                          </Button>
                        )}
                      </div>

                      {selectedImage && (
                        <div className="position-relative">
                          <img
                            id="imagePreview"
                            alt="Selected"
                            className="rounded"
                            style={{ maxWidth: "180px", height: "auto" }}
                          />
                        </div>
                      )}

                      <form
                        className="d-flex gap-2"
                        onSubmit={handleSubmit}
                      >
                        <input
                          type="text"
                          name="message"
                          className="form-control"
                          placeholder="Type your message..."
                        />
                        <Button type="submit" variant="primary">
                          <BsSend />
                        </Button>
                      </form>
                    </div>
                  </Card.Footer>                </>
              ) : (
                <Card.Body className="d-flex align-items-center justify-content-center text-muted">
                  Select a chat or start a new conversation
                </Card.Body>
              )}
            </Card>
          </div>
        </div>
      </div>

      <UserSelectionModal
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        chatMode={chatMode}
        groupName={groupName}
        setGroupName={setGroupName}
        search={search}
        setSearch={setSearch}
        searchResults={searchResults}
        selectedUsers={selectedUsers}
        handleSearch={handleSearch}
        handleUserSelect={handleUserSelect}
        handleCreateChat={handleCreateChat}
      />

      {/* Toast Notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Message from {currentNotification?.senderUsername}</strong>
          <small>{currentNotification?.timestamp && new Date(currentNotification.timestamp).toLocaleTimeString()}</small>
        </Toast.Header>
        <Toast.Body>{currentNotification?.message}</Toast.Body>
      </Toast>
    </div>
  );
}
export default Chat;
