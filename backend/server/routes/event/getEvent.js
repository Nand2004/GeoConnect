const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");
const Chat = require("../../models/chatModel");

router.get("/getEvent/:eventId", async (req, res) => {
    const { eventId } = req.params;
  
    try {
      const event = await Event.findById(eventId).populate("attendees.userId", "username profileImage");
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      return res.status(200).json(event);
    } catch (error) {
      console.error("Error fetching event details:", error);
      return res.status(500).json({ message: "Server error while fetching event details" });
    }
  });
  
module.exports = router;
