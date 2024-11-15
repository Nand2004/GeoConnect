const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");

router.get("/getNearbyEvents", async (req, res) => {
  const { longitude, latitude, radius = 10 } = req.query;

  try {
    if (!longitude || !latitude) {
      return res.status(400).json({ message: "Missing required location parameters" });
    }

    // Find events within the specified radius
    const events = await Event.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], radius / 3963.2], // Convert radius to radians
        },
      },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching nearby events:", error);
    return res.status(500).json({ message: "Server error while fetching nearby events" });
  }
});

module.exports = router;
