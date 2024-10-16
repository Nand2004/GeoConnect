//Retrieves chats where the user has unread messages.
//GET
// routes/chat/chatUnread.js

const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to get unread chats for a user
router.get("/chatUnread", async (req, res) => {
  const { userId } = req.query;

  try {
    const chats = await Chat.find({
      "messages.readBy.user": { $ne: userId }
    });

    return res.json(chats);
  } catch (error) {
    console.error("Error fetching unread chats:", error);
    return res.status(500).json({ message: "Server error while fetching unread chats" });
  }
});

module.exports = router;
