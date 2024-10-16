//Updates the role of a user in a group chat.
//POST
// routes/chat/chatGroupRoleUpdate.js

const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to update a user's role in a group chat
router.post("/chatGroupRoleUpdate/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { userId, role } = req.body;

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, "users.userId": userId },
      { $set: { "users.$.role": role } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat or user not found" });
    }

    return res.status(200).json({ message: "User role updated", chat });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Server error while updating user role" });
  }
});

module.exports = router;
