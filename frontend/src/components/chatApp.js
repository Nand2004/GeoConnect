import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect to the socket server
const socket = io("http://localhost:8081");

function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("listeningMessage", (newMessage) => {
      console.log("New message received:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("listeningMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      socket.emit("sendingMessage", message);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chatting</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter Message"
        style={{ marginBottom: "10px", padding: "8px", width: "300px" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px" }}>Send</button>
      <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px", maxHeight: "300px", overflowY: "auto" }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <p key={index} style={{ margin: "5px 0", padding: "5px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
              {msg}
            </p>
          ))
        ) : (
          <p>No messages yet. Start chatting!</p>
        )}
      </div>
    </div>
  );
}

export default ChatApp;
