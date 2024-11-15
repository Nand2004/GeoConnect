const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");
const Chat = require("../../models/chatModel");

router.put("/updateEvent/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { userId, updates } = req.body; // `updates` is an object with fields to update

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is the creator
    if (event.creatorId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Apply updates to the event
    Object.keys(updates).forEach((key) => {
      if (key in event) {
        event[key] = updates[key];
      }
    });

    // If the event name is updated, update the chat name as well
    if (updates.name) {
      const chat = await Chat.findById(event.chatId);
      if (chat) {
        chat.chatName = updates.name; // Update the chat's name
        await chat.save();
      }
    }

    await event.save();

    return res.status(200).json({ message: "Event successfully updated", event });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ message: "Server error while updating event" });
  }
});

module.exports = router;
