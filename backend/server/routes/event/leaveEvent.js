const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");
const Chat = require("../../models/chatModel");

router.post("/leaveEvent", async (req, res) => {
  const { eventId, userId } = req.body;

  try {
    if (!eventId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Remove the user from the event attendees list
    const updatedAttendees = event.attendees.filter(
      (attendee) => attendee.userId.toString() !== userId
    );

    // If the user is not in the attendees list, return an error
    if (updatedAttendees.length === event.attendees.length) {
      return res.status(400).json({ message: "User is not an attendee of this event" });
    }

    event.attendees = updatedAttendees;
    await event.save();

    // If the event has an associated chat, remove the user from the chat's users list
    if (event.chatId) {
      const chat = await Chat.findById(event.chatId);
      if (chat) {
        // Remove the user from the chat's users array
        chat.users = chat.users.filter((user) => user.userId.toString() !== userId);
        await chat.save();
      }
    }

    return res.status(200).json({ message: "User successfully left the event", event });
  } catch (error) {
    console.error("Error leaving event:", error);
    return res.status(500).json({ message: "Server error while leaving event" });
  }
});

module.exports = router;
