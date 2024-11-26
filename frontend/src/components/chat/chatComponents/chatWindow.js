import React, { useEffect, useRef } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { MdOutlineGroup, MdModeEdit } from 'react-icons/md';
import { BsSend, BsImage } from 'react-icons/bs';
import ImageUploadHandler from '../imageChatComponents/imageUploadHandler';

function ChatWindow({
  chatId,
  chatHistory,
  currentUser,
  messages,
  handleGroupManagementModalOpen,
  handleSubmit,
  selectedImage,
  handleImageChange,
  clearImageSelection,
  setEnlargedImage
}) {
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Determine chat title and type
  const currentChat = chatHistory.find((chat) => chat._id === chatId);
  const isChatGroup = currentChat?.chatType === "group";
  const chatTitle = isChatGroup 
    ? currentChat?.chatName || "Unnamed Group"
    : currentChat?.usernames.filter((username) => username !== currentUser.username).join(", ");

  return (
    <Card className="h-100 shadow-sm border-0">
      {chatId ? (
        <>
          <Card.Header 
            className={`bg-${isChatGroup ? 'primary' : 'info'} text-white d-flex align-items-center justify-content-between py-3`}
          >
            <div className="d-flex align-items-center gap-3">
              {isChatGroup ? <MdOutlineGroup size={24} /> : null}
              <h5 className="mb-0 text-truncate" style={{ maxWidth: '300px' }}>
                {chatTitle}
              </h5>
              {isChatGroup && (
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleGroupManagementModalOpen}
                  className="d-flex align-items-center"
                >
                  <MdModeEdit className="me-1" /> Edit
                </Button>
              )}
            </div>
          </Card.Header>
          
          <Card.Body 
            className="d-flex flex-column overflow-hidden p-0" 
            style={{ height: 'calc(100% - 160px)' }}
          >
            <div 
              className="flex-grow-1 p-3 overflow-auto" 
              style={{ 
                backgroundColor: '#f8f9fa', 
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0,0,0,0.2) transparent'
              }}
            >
              {messages.length > 0 ? (
                messages.map((msg, index) => {
                  const isCurrentUser = msg.userId === currentUser.id;
                  const sender = currentChat?.usernames.find(user => 
                    user !== currentUser.username && user === msg.username
                  ) || msg.username;

                  return (
                    <div
                      key={index}
                      className={`d-flex flex-column mb-3 ${isCurrentUser ? 'align-items-end' : 'align-items-start'}`}
                    >
                      {isChatGroup && !isCurrentUser && (
                        <small className="text-muted mb-1" style={{ fontSize: '0.7rem' }}>
                          {sender}
                        </small>
                      )}
                      <div
                        className={`
                          p-3 rounded-4 shadow-sm 
                          ${isCurrentUser 
                            ? 'bg-primary text-white' 
                            : 'bg-dark text-white'}`
                        }
                        style={{ 
                          maxWidth: '70%', 
                          fontSize: '0.95rem',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                      >
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="d-flex flex-column gap-2 mb-2">
                            {msg.attachments.map((attachment, idx) => (
                              <div key={idx} className="position-relative">
                                <img
                                  src={attachment.type}
                                  alt={attachment.name}
                                  className="rounded-3 img-fluid cursor-pointer"
                                  style={{ 
                                    maxHeight: '200px', 
                                    objectFit: 'cover',
                                    transition: 'transform 0.2s'
                                  }}
                                  onClick={() => setEnlargedImage(attachment.type)}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {msg.message && (
                          <div 
                            className={`message-text ${isCurrentUser ? 'text-white-75' : 'text-white-75'}`}
                          >
                            {msg.message}
                          </div>
                        )}
                        <small 
                          className={`d-block text-end mt-2 ${
                            isCurrentUser ? 'text-white-50' : 'text-white-50'
                          }`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted py-4">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} /> 
            </div>
          </Card.Body>
          
          <Card.Footer className="bg-white border-top-0 p-3">
            <ImageUploadHandler
              selectedImage={selectedImage}
              handleImageChange={handleImageChange}
              clearImageSelection={clearImageSelection}
            />
            <form
              className="d-flex gap-2"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="message"
                className="form-control form-control-lg rounded-pill"
                placeholder="Type your message..."
              />
              <Button 
                type="submit" 
                variant="primary" 
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px' }}
              >
                <BsSend />
              </Button>
            </form>
          </Card.Footer>
        </>
      ) : (
        <Card.Body className="d-flex align-items-center justify-content-center text-muted">
          <div className="text-center">
            <h4>Welcome to Chat</h4>
            <p>Select a chat or start a new conversation</p>
          </div>
        </Card.Body>
      )}
    </Card>
  );
}

export default ChatWindow;