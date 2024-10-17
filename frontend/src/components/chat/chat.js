import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Spinner } from 'react-bootstrap';  // Bootstrap components for Modal and Spinner

function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([
    { sender: 'Sam Edwards', text: 'Hi Zoe!', time: '20:50' },
    { sender: 'You', text: 'How’s it going?', time: '20:51' },
  ]);
  const [typing, setTyping] = useState(false);  // To show typing indicator
  const [search, setSearch] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);  // For profile modal

  const users = [
    { name: 'Sam Edwards', avatar: '/path/to/avatar1.png', status: 'online' },
    { name: 'Rebecca Barker', avatar: '/path/to/avatar2.png', status: 'away' },
    { name: 'Alyssa Davis', avatar: '/path/to/avatar3.png', status: 'offline' },
    { name: 'Jack John', avatar: '/path/to/avatar4.png', status: 'online' },
    { name: 'Felix Forbes', avatar: '/path/to/avatar5.png', status: 'away' },
  ];

  const handleSendMessage = (messageText) => {
    setMessages([...messages, { sender: 'You', text: messageText, time: new Date().toLocaleTimeString() }]);
    setTyping(false);  // Stop typing indicator when message is sent
  };

  useEffect(() => {
    // Simulate typing after 2 seconds
    if (selectedUser) {
      setTyping(true);
      const timer = setTimeout(() => setTyping(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedUser]);

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
        <ul className="list-unstyled" style={styles.userList}>
          {users
            .filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
            .map(user => (
              <li
                key={user.name}
                onClick={() => setSelectedUser(user)}
                style={styles.userItem}
                className="d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center">
                  <img src={user.avatar} alt={user.name} style={styles.avatar} />
                  <span>{user.name}</span>
                </div>
                <span style={{ ...styles.statusBadge, ...styles[user.status] }}>{user.status}</span>
              </li>
            ))}
        </ul>
      </div>

      {selectedUser ? (
        <div className="d-flex flex-column" style={styles.chatWindow}>
          <div className="d-flex align-items-center" style={styles.chatHeader}>
            <img
              src={selectedUser.avatar}
              alt={selectedUser.name}
              style={styles.avatar}
              onClick={() => setShowProfileModal(true)}  // Open modal on click
            />
            <h2>{selectedUser.name}</h2>
          </div>
          <div className="flex-grow-1 d-flex flex-column" style={styles.chatMessages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-bubble ${message.sender === 'You' ? 'sent' : 'received'}`}
                style={{
                  ...styles.messageBubble,
                  alignSelf: message.sender === 'You' ? 'flex-end' : 'flex-start',
                  backgroundColor: message.sender === 'You' ? '#00D27A' : '#394866',
                }}
              >
                <p>{message.text}</p>
                <span style={styles.messageTime}>{message.time}</span>
              </div>
            ))}
            {typing && (
              <div className="d-flex align-items-center" style={styles.typingIndicator}>
                <Spinner animation="grow" size="sm" className="mr-2" />
                <span>{selectedUser.name} is typing...</span>
              </div>
            )}
          </div>
          <form
            style={styles.messageInput}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(e.target.message.value);
              e.target.message.value = '';
            }}
          >
            <input
              type="text"
              name="message"
              className="form-control"
              style={styles.inputField}
              placeholder="Send a message..."
              onKeyPress={() => setTyping(true)}
            />
            <button type="submit" className="btn btn-primary" style={styles.sendButton}>
              Send
            </button>
          </form>
        </div>
      ) : (
        <div style={styles.welcomeMessage}>Select a user to start chatting!</div>
      )}

      {/* Modal for showing the profile */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser?.name}'s Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img src={selectedUser?.avatar} alt={selectedUser?.name} style={styles.modalAvatar} />
            <h4>{selectedUser?.name}</h4>
            <p>Status: <strong>{selectedUser?.status}</strong></p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    background: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)',
    color: 'white',
  },
  sidebar: {
    width: '25%',
    backgroundColor: '#2C3E50',
    padding: '15px',
    borderRight: '1px solid #ccc',
  },
  searchBar: {
    marginBottom: '20px',
    borderRadius: '20px',
    padding: '10px',
    backgroundColor: '#34495E',
    color: 'white',
    border: 'none',
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
    borderRadius: '10px',
    transition: 'background-color 0.3s ease',
    color: '#ecf0f1',
  },
  userItemHover: {
    backgroundColor: '#1C2833',
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    marginRight: '12px',
    cursor: 'pointer',
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  online: {
    backgroundColor: '#00C851',
    color: '#fff',
  },
  away: {
    backgroundColor: '#ffbb33',
    color: '#fff',
  },
  offline: {
    backgroundColor: '#ff4444',
    color: '#fff',
  },
  chatWindow: {
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#212F3D',
    padding: '25px',
  },
  chatHeader: {
    paddingBottom: '15px',
    borderBottom: '1px solid #444',
  },
  chatMessages: {
    flexGrow: 1,
    padding: '25px',
    overflowY: 'auto',
  },
  messageBubble: {
    padding: '12px 18px',
    borderRadius: '20px',
    margin: '12px 0',
    maxWidth: '60%',
  },
  messageTime: {
    display: 'block',
    textAlign: 'right',
    fontSize: '0.8em',
    marginTop: '5px',
    color: '#ccc',
  },
  typingIndicator: {
    color: '#aaa',
  },
  messageInput: {
    display: 'flex',
    paddingTop: '10px',
  },
  inputField: {
    flexGrow: 1,
    marginRight: '10px',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#00B74A',
    color: 'white',
    borderRadius: '25px',
    border: 'none',
    cursor: 'pointer',
  },
  welcomeMessage: {
    padding: '20px',
    color: 'white',
  },
  modalAvatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '20px',
  },
};

export default ChatPage;
