//This route sends a new message in the chat.
//POST
// routes/chat/chatSendMessage.js

const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to send a new message in a chat
router.post("/chatSendMessage/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { sender, message, attachments } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.messages.push({ sender, message, attachments });
    chat.lastActivity = new Date(); // Update last activity time
    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Server error while sending message" });
  }
});

module.exports = router;
