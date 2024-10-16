//Searches chats and messages based on a query.
//GET
// routes/chat/chatSearch.js

const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");

// Route to search chats and messages
router.get("/chatSearch", async (req, res) => {
  const { userId, query } = req.query;

  try {
    const chats = await Chat.find({
      users: { $elemMatch: { userId } },
      $or: [
        { chatName: { $regex: query, $options: "i" } },
        { "messages.message": { $regex: query, $options: "i" } }
      ]
    });

    return res.json(chats);
  } catch (error) {
    console.error("Error searching chats:", error);
    return res.status(500).json({ message: "Server error while searching chats" });
  }
});

module.exports = router;
