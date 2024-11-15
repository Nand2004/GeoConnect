const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");
const Chat = require("../../models/chatModel");

router.post("/createEvent", async (req, res) => {
  const { name, description, location, dateTime, category, creatorId } = req.body;

  try {
    // Validate required fields
    if (!name || !location || !dateTime || !creatorId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if event already exists (e.g., by name and location)
    const existingEvent = await Event.findOne({ name, location });
    if (existingEvent) {
      // Return the existing event data if it exists
      return res.status(200).json({ event: existingEvent, message: "Event already exists" });
    }

    // Create the event
    const newEvent = new Event({
      name,
      description,
      location,
      dateTime,
      category,
      creatorId,
    });
    await newEvent.save();

    // Automatically create a group chat for the event
    const eventChat = new Chat({
      chatType: "group",
      chatName: name,
      users: [{ userId: creatorId, role: "admin" }],
      event: newEvent._id, // Link the chat to the event
    });
    await eventChat.save();

    // Link the chat to the event
    newEvent.chatId = eventChat._id;
    await newEvent.save();

    return res.status(201).json({ event: newEvent, chat: eventChat });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Server error while creating event" });
  }
});

module.exports = router;
