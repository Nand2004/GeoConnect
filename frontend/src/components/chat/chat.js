import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast } from "react-bootstrap";
import axios from "axios";
import { io } from "socket.io-client";
import getUserInfo from "../../utilities/decodeJwt";
import "./chat.css";
import { useLocation } from "react-router-dom";

//Chat Components
import ChatSidebar from "./chatComponents/chatSidebar";
import ChatWindow from "./chatComponents/chatWindow";
import ImageEnlarged from "./imageChatComponents/imageEnlarged";
import GroupManagementModal from "./groupManagement/groupManagementModal";
import UserSelectionModal from "./chatModal/userSelectionModal";
import NotificationToast from "./notificationToast/notifactionToast";

function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // eslint-disable-next-line
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null); // eslint-disable-next-line
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
  const [enlargedImage, setEnlargedImage] = useState(null);

  const [showGroupManagementModal, setShowGroupManagementModal] =
    useState(false);
  const [groupUsers, setGroupUsers] = useState([]);

  const handleGroupManagementModalOpen = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/chat/chatGetByChatId/${chatId}`
      );
      setGroupUsers(response.data.users);
      setShowGroupManagementModal(true);
    } catch (error) {
      console.error("Error fetching group members:", error);
      setError("Error fetching group members.");
    }
  };

  const handleUserRemoved = (user) => {
    setGroupUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
  };

  const handleUserAdded = (user) => {
    setGroupUsers((prevUsers) => [...prevUsers, user]);
  };

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
                  const response = await axios.get(
                    `http://localhost:8081/user/getUsernameByUserId/${user.userId}`
                  );
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
      setError("Image size must be less than 5MB");
      return;
    }

    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgPreview = event.target.result;
        const previewElement = document.getElementById("imagePreview");
        if (previewElement) {
          previewElement.src = imgPreview;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    if (document.getElementById("imagePreview")) {
      document.getElementById("imagePreview").src = "";
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
      const filteredResults = data.filter(
        (user) => user._id !== currentUser.id
      );
      setSearchResults(filteredResults);
      setError("");
    } catch {
      setError("Error searching for users.");
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.some((selected) => selected._id === user._id)) {
      setSelectedUsers(
        selectedUsers.filter((selected) => selected._id !== user._id)
      );
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
      const userIds = [
        currentUser.id,
        ...selectedUsers.map((user) => user._id),
      ];
      const isGroup = chatMode === "group" && selectedUsers.length > 1;

      const body = {
        chatType: isGroup ? "group" : "direct",
        users: userIds,
        ...(isGroup && { chatName: groupName }), // Store the group name as chatName in the request body
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
          message: msg.message || "",
          timestamp: msg.timestamp,
          attachments: msg.attachments
            ? msg.attachments.map((attachment) => ({
              type: attachment,
              name: attachment.split("/").pop(), // Extract filename from URL
              mimeType: attachment.match(/\.(jpg|jpeg|png|gif)$/i)
                ? "image/" + attachment.split(".").pop().toLowerCase()
                : "application/octet-stream",
            }))
            : [],
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
        setError("Chat session not found");
        return;
      }

      if (!message?.trim() && !selectedImage) {
        setError("Please provide a message or image");
        return;
      }

      // Prepare base message object
      const newMessage = {
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        message: message?.trim() || "",
        attachments: [],
      };

      // Handle image upload if present
      let uploadedImageUri = null;
      if (selectedImage) {
        try {
          const formData = new FormData();
          formData.append("image", selectedImage);
          formData.append("name", `${currentUser.id}_${Date.now()}`);

          const imageResponse = await axios.post(
            "http://localhost:8081/image/createImage",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (imageResponse.data && imageResponse.data.imageUri) {
            uploadedImageUri = imageResponse.data.imageUri;
            newMessage.attachments = [
              {
                type: uploadedImageUri,
                name: selectedImage.name,
                mimeType: selectedImage.type,
              },
            ];
          }
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          setError("Failed to upload image. Please try again.");
          return;
        }
      }

      // Send message to backend
      const messageResponse = await axios.post(
        `http://localhost:8081/chat/chatSendMessage/${chatId}`,
        {
          sender: currentUser.id,
          message: newMessage.message,
          attachments: uploadedImageUri ? [uploadedImageUri] : [],
        }
      );

      if (messageResponse.data) {
        // Update local messages state
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Emit socket event
        if (socket) {
          socket.emit("sendingMessage", {
            chatId,
            sender: currentUser.id,
            message: newMessage.message,
            attachments: newMessage.attachments,
          });
        }

        // Clear image preview and selection
        if (selectedImage) {
          setSelectedImage(null);
          const previewElement = document.getElementById("imagePreview");
          if (previewElement) {
            previewElement.src = "";
          }
        }
        return true; // Indicate successful message send
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setError(error.message || "Error sending message. Please try again.");
      return false; // Indicate failed message send
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8081/chat/deleteChat/${chatId}`);
      setChatHistory((prev) => prev.filter((chat) => chat._id !== chatId));
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
    setUnreadCounts((prev) => ({
      ...prev,
      [chat._id]: 0,
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
              (user) => user.userId === currentUser.id
            );

            if (isUserInChat) {
              setUnreadCounts((prev) => ({
                ...prev,
                [message.chatId]: (prev[message.chatId] || 0) + 1,
              }));

              const notification = {
                id: Date.now(),
                message: message.attachments?.length
                  ? "📎 Sent an image"
                  : message.message,
                sender: message.sender,
                senderUsername: senderUsername,
                chatId: message.chatId,
                timestamp: new Date().toISOString(),
              };

              setNotifications((prev) => [...prev, notification]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value;

    try {
      const success = await handleSendMessage(messageText, selectedImage);
      if (success) {
        e.target.message.value = "";
        setSelectedImage(null);
        const previewElement = document.getElementById("imagePreview");
        if (previewElement) {
          previewElement.src = "";
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError("Failed to send message");
    }
  };

  return (
    <div
      className="vh-100 pt-4"
      style={{ paddingTop: "60px", overflowY: "auto" }}
    >
      <div
        className="container-fluid h-100"
        style={{
          height: "60vh",
          overflow: "hidden",
          paddingTop: "55px",
          background: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
        }}
      >
        <div className="row h-100">
          {/* Sidebar */}
          <div className="col-md-4 col-lg-3 h-100">
            <ChatSidebar
              chatHistory={chatHistory}
              currentUser={currentUser}
              chatId={chatId}
              handleChatSelect={handleChatSelect}
              handleDeleteChat={handleDeleteChat}
              setChatMode={setChatMode}
              setShowUserModal={setShowUserModal}
              setSelectedUsers={setSelectedUsers}
              setSearch={setSearch}
              unreadCounts={unreadCounts}
              error={error}
              successMessage={successMessage}
            />
          </div>

          {/* Chat Window */}
          <div className="col-md-8 col-lg-9 h-100">
            <ChatWindow
              chatId={chatId}
              chatHistory={chatHistory}
              currentUser={currentUser}
              messages={messages}
              handleGroupManagementModalOpen={handleGroupManagementModalOpen}
              handleSubmit={handleSubmit}
              selectedImage={selectedImage}
              handleImageChange={handleImageChange}
              clearImageSelection={clearImageSelection}
              setEnlargedImage={setEnlargedImage}
            />
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

      <GroupManagementModal
        show={showGroupManagementModal}
        onHide={() => setShowGroupManagementModal(false)}
        chatId={chatId}
        currentUser={currentUser}
        groupUsers={groupUsers}
        onUserRemoved={handleUserRemoved}
        onUserAdded={handleUserAdded}
      />

      <NotificationToast
        show={showToast}
        onClose={() => setShowToast(false)}
        currentNotification={currentNotification}
      />

      <ImageEnlarged
        image={enlargedImage}
        onClose={() => setEnlargedImage(null)}
      />
    </div>
  );
}
export default Chat;
