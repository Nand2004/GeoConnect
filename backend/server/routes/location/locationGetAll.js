const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel');

// Route to get all locations
router.get('/locationGetAll', async (req, res) => {
  try {
    // Find all users and return only their location, username, and email
    const locations = await newUserModel.find({}, { location: 1, username: 1, email: 1 });

    // If no users found
    if (!locations || locations.length === 0) {
      return res.status(404).json({ message: "No locations found" });
    }

    return res.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
