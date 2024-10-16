//Marks a message as read by a specific user.
//POST
// routes/chat/chatMessageMarkRead.js

const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to mark a message as read
router.post("/messageMarkRead/:chatId/:messageId", async (req, res) => {
  const { chatId, messageId } = req.params;
  const { userId } = req.body;

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, "messages._id": messageId },
      { $addToSet: { "messages.$.readBy": { user: userId, readAt: new Date() } } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat or message not found" });
    }

    return res.status(200).json({ message: "Message marked as read", chat });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return res.status(500).json({ message: "Server error while marking message as read" });
  }
});

module.exports = router;
