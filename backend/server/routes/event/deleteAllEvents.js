const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");

router.delete("/deleteAllEvents", async (req, res) => {
  try {
    // Delete all events from the database
    const result = await Event.deleteMany({});

    // If no events are deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No events found to delete" });
    }

    return res.status(200).json({ message: "All events deleted successfully" });
  } catch (error) {
    console.error("Error deleting events:", error);
    return res.status(500).json({ message: "Server error while deleting events" });
  }
});

module.exports = router;
