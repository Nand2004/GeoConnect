import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Create the socket connection outside the component
const socket = io("http://localhost:8081");

function ChatApp() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("Connecting to socket server...");
        
        socket.on("connect", () => {
            console.log("Connected to the socket server"); // Confirm connection
        });

        const messageHandler = (newMessage) => {
            console.log("Received message:", newMessage); // Log received message
            setMessages((prevMessages) => {
                console.log("Previous Messages:", prevMessages); // Log previous messages
                return [...prevMessages, newMessage];
            });
        };

        socket.on("message", messageHandler);

        return () => {
            socket.off("message", messageHandler); // Cleanup
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            console.log("Sending message:", message); // Log message being sent
            socket.emit("user-message", message);
            setMessage(""); // Clear input after sending
        }
    };

    console.log("Messages array:", messages); // Log messages before rendering

    return (
        <div style={{ padding: "20px" }}>
            <h1>Chatting</h1>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter Message"
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <p key={index}>{msg}</p>
                    ))
                ) : (
                    <p>No messages yet.</p> // Add a message when there are no messages
                )}
            </div>
        </div>
    );
}

export default ChatApp;
