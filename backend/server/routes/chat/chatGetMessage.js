//Retrieves all message for a given chat ID.
//GET
// routes/chat/chatMessages.js

const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to get all messages of a chat by chatId
router.get("/chatGetMessage/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId, { messages: 1 });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.json(chat.messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return res.status(500).json({ message: "Server error while fetching chat messages" });
  }
});

module.exports = router;
