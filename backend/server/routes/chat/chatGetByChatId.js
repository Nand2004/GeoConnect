//This route retrieves details of a specific chat by its ID.
//GET
// routes/chat/chatGetByChatId.js

const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to get a chat by ID
router.get("/chatGetByChatId/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    return res.status(500).json({ message: "Server error while fetching chat" });
  }
});

module.exports = router;
