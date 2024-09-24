const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel');

// Route to get a specific user's location
router.get('/locationGetByUserId/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await newUserModel.findById(userId, { location: 1, username: 1, email: 1 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error fetching user's location:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
