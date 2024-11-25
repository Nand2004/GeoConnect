const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");
const Chat = require("../../models/chatModel"); // Import the Chat model

router.delete("/deleteAllEvents", async (req, res) => {
  try {
    // Find all events to get associated chat IDs
    const events = await Event.find({});
    if (events.length === 0) {
      return res.status(404).json({ message: "No events found to delete" });
    }

    // Collect all associated chat IDs
    const chatIds = events
      .map(event => event.chatId) // Extract chatId from each event
      .filter(chatId => chatId); // Filter out null/undefined chatIds

    // Delete all events
    const eventResult = await Event.deleteMany({});

    // Delete all associated chats
    if (chatIds.length > 0) {
      await Chat.deleteMany({ _id: { $in: chatIds } });
    }

    return res.status(200).json({ 
      message: "All events and associated chats deleted successfully",
      deletedEvents: eventResult.deletedCount,
      deletedChats: chatIds.length 
    });
  } catch (error) {
    console.error("Error deleting events and chats:", error);
    return res.status(500).json({ message: "Server error while deleting events and chats" });
  }
});

module.exports = router;
