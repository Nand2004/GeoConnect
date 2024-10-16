//This route allows a user to archive a chat.
//POST
// routes/chat/chatArchive.js

const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to archive a chat
router.post("/chatArchive/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findByIdAndUpdate(chatId, { isArchived: true }, { new: true });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({ message: "Chat archived successfully", chat });
  } catch (error) {
    console.error("Error archiving chat:", error);
    return res.status(500).json({ message: "Server error while archiving chat" });
  }
});

module.exports = router;
