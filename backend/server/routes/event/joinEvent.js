const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");
const Chat = require("../../models/chatModel");

router.post("/joinEvent", async (req, res) => {
  const { eventId, userId } = req.body;

  try {
    if (!eventId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is the creator of the event
    if (event.creatorId.toString() === userId) {
      return res.status(400).json({ message: "Creator cannot join their own event" });
    }

    // Check if the user is already an attendee
    const isAttendee = event.attendees.some(
      (attendee) => attendee.userId.toString() === userId
    );
    if (isAttendee) {
      return res.status(400).json({ message: "User already joined the event" });
    }

    // Add user to the event attendees list
    event.attendees.push({ userId, joinedAt: new Date() });
    await event.save();

    // If the event has an associated chat, add the user to the chat
    if (event.chatId) {
      const chat = await Chat.findById(event.chatId);
      if (chat) {
        // Add the user to the chat's users list
        chat.users.push({ userId, role: "member", joinedAt: new Date() });
        await chat.save();
      }
    }

    return res.status(200).json({ message: "User successfully joined the event", event });
  } catch (error) {
    console.error("Error joining event:", error);
    return res.status(500).json({ message: "Server error while joining event" });
  }
});

module.exports = router;
