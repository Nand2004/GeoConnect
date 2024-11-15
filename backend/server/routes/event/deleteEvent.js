const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");
const Chat = require("../../models/chatModel");

router.delete("/deleteEvent/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body; // User requesting the deletion

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is the creator of the event
    if (event.creatorId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Remove the associated chat if it exists
    if (event.chatId) {
      const chat = await Chat.findById(event.chatId);
      if (chat) {
        await Chat.findByIdAndDelete(event.chatId); // Delete the chat associated with the event
      }
    }

    // Delete the event
    await event.deleteOne();

    return res.status(200).json({ message: "Event and associated chat successfully deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ message: "Server error while deleting event" });
  }
});

module.exports = router;
