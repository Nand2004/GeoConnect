// routes/chat/chatGroupAddUser.js
// POST: Adds a user to a group chat by userId.

const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to add a user to a group chat by userId
router.post("/chatAddGroupUser/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.body;

  try {
    // Find the chat by chatId
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the user is already in the chat
    if (!chat.users.find(user => user.userId === userId)) {
      // Add the user to the chat
      chat.users.push({ userId, joinedAt: new Date() });
      await chat.save();
    }

    return res.status(200).json({ message: "User added to chat", chat });
  } catch (error) {
    console.error("Error adding user to chat:", error);
    return res.status(500).json({ message: "Server error while adding user to chat" });
  }
});

module.exports = router;
