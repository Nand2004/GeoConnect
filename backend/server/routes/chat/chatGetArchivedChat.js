const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to get archived chats for a user
router.get("/chatGetArchivedChat", async (req, res) => {
  const { userId } = req.query;

  try {
    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Retrieve archived chats where the user is a participant
    const chats = await Chat.find({
      isArchived: true,
      users: { $elemMatch: { userId } }
    }).lean(); // Using `.lean()` for better performance

    // Return the found chats
    return res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching archived chats:", error);
    return res.status(500).json({ message: "Server error while fetching archived chats" });
  }
});

module.exports = router;
