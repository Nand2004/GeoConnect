const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");
const mongoose = require("mongoose"); 

router.get("/getEvent/:eventId", async (req, res) => {
  const { eventId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const event = await Event.findById(eventId).populate("attendees.userId", "username profileImage");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    return res.status(500).json({ message: "Server error while fetching event details", error: error.message });
  }
});

module.exports = router;
