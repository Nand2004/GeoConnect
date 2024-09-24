const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel');

// Route to update user's location
router.post('/locationUpdate', async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  try {
    // Validate input
    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ message: "User ID, latitude, and longitude are required" });
    }

    const user = await newUserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.location = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    await user.save();
    return res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error("Error updating location:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
