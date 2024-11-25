import {React, useEffect, useRef} from 'react';
import { Card, Button } from 'react-bootstrap';
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

    
  return (
    <Card className="h-100">
      {chatId ? (
        <>
          <Card.Header>
            <h5 className="mb-0 d-flex align-items-center gap-2">
              {chatHistory.find((chat) => chat._id === chatId)?.chatType === "group" ? (
                <>
                  {chatHistory.find((chat) => chat._id === chatId)?.chatName || "Unnamed Group"}
                  <MdOutlineGroup />
                  <Button 
                    style={{color: 'black', size: '20px'}} 
                    onClick={handleGroupManagementModalOpen}
                  > 
                    <MdModeEdit className="ms-2" /> 
                  </Button>
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
                                onClick={() => setEnlargedImage(attachment.type)}
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
              )}
              <div ref={messagesEndRef} /> 

            </div>
          </Card.Body>
          <Card.Footer className="bg-white">
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
                className="form-control"
                placeholder="Type your message..."
              />
              <Button type="submit" variant="primary">
                <BsSend />
              </Button>
            </form>
          </Card.Footer>
        </>
      ) : (
        <Card.Body className="d-flex align-items-center justify-content-center text-muted">
          Select a chat or start a new conversation
        </Card.Body>
      )}
    </Card>
  );
}

export default ChatWindow;