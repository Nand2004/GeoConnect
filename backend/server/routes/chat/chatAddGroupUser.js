// routes/chat/chatGroupAddUser.js
//POST
// Adds a user to a group chat.


const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to add a user to a group chat
router.post("/chatAddGroupUser/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { userId, role = "member" } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Add the user only if they aren't already in the chat
    if (!chat.users.find(user => user.userId === userId)) {
      chat.users.push({ userId, role, joinedAt: new Date() });
      await chat.save();
    }

    return res.status(200).json({ message: "User added to chat", chat });
  } catch (error) {
    console.error("Error adding user to chat:", error);
    return res.status(500).json({ message: "Server error while adding user to chat" });
  }
});

module.exports = router;
