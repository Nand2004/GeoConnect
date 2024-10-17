import React, { useState } from 'react';
import MessageInput from './messageInput';

function ChatWindow({ user }) {
  const [messages, setMessages] = useState([
    { sender: 'Sam Edwards', text: 'Hi Zoe!', time: '20:50' },
    { sender: 'You', text: 'How’s it going?', time: '20:51' },
  ]);

  const handleSendMessage = (messageText) => {
    setMessages([...messages, { sender: 'You', text: messageText, time: new Date().toLocaleTimeString() }]);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src={user.avatar} alt={user.name} className="avatar" />
        <h2>{user.name}</h2>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-bubble ${message.sender === 'You' ? 'sent' : 'received'}`}>
            <p>{message.text}</p>
            <span className="message-time">{message.time}</span>
          </div>
        ))}
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;
