//Removes a user from a group chat.
//POST

// routes/chat/chatRemoveGroupUser.js

const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to remove a user from a group chat
router.post("/chatRemoveGroupUser/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.body;

  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: { userId } } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({ message: "User removed from chat", chat });
  } catch (error) {
    console.error("Error removing user from chat:", error);
    return res.status(500).json({ message: "Server error while removing user from chat" });
  }
});

module.exports = router;
