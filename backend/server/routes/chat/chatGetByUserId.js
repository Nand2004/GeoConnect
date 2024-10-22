const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel"); // Importing from chatModel

// Route to get all chats by user ID
router.get("/chatGetByUserId/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({
      "users.userId": userId // Find chats where userId is in the users array
    });

    if (chats.length === 0) {
      return res.status(404).json({ message: "No chats found for this user" });
    }

    return res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ message: "Server error while fetching chats" });
  }
});

module.exports = router;
