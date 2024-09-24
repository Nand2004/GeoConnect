const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel');

// Route to delete a user's location
router.delete('/locationDelete/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await newUserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.location = undefined; // Remove location
    await user.save();
    return res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error("Error deleting location:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
