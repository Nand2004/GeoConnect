const express = require("express");
const router = express.Router();
const Chat = require("../../models/chatModel");
const User = require("../../models/userModel"); 


router.post("/chatCreateChat", async (req, res) => {
  let { users, chatType, chatName = "" } = req.body;

  
  try {

    if (!users || users.length < 2) {
      return res.status(400).json({ message: "A chat requires at least 2 users." });
    }
    
    // Check if all provided user IDs exist in the database
    const existingUsers = await User.find({ _id: { $in: users } });
    if (existingUsers.length !== users.length) {
      return res.status(400).json({ message: "One or more user IDs are invalid." });
    }

    // If users are more than 2, set chatType to 'group' automatically.
    if (users.length > 2) {
      chatType = "group";
    } else if (!chatType) {
      chatType = "direct"; // Default to 'direct' for 2 or fewer users if not specified.
    }

    // Sort users for consistency in finding existing direct chats
    const sortedUsers = users.sort();
    let chat;

    // Check if a direct chat already exists between the two users
    if (chatType === "direct" && sortedUsers.length === 2) {
      chat = await Chat.findOne({ 
        "users.userId": { $all: sortedUsers }, // Corrected query structure
        chatType: "direct" 
      });
    }
    else if (chatType === "group") {
      chat = await Chat.findOne({ 
        "users.userId": { $all: sortedUsers }, 
        chatType: "group",
        users: { $size: sortedUsers.length } // Ensure that the user count matches
      });
    }
    

    // If no existing direct chat or it's a group chat, create a new one
    if (!chat) {
      chat = new Chat({ 
        users: sortedUsers.map(user => ({ userId: user })), 
        chatType, 
        chatName: chatType === "group" ? chatName : "" 
      });
      await chat.save();
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ message: "Server error while creating chat" });
  }
});

module.exports = router;
