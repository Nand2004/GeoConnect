
import React, { useState } from 'react';

function MessageInput({ onSendMessage }) {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input 
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Send a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageInput;
