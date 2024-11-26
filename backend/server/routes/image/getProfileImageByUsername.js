// routes/getUserProfileImage.js

const express = require('express');
const router = express.Router();
const User = require('../../models/userModel');  // Adjust the path if needed

// Route to fetch the user's profile image by username
router.get('/getUserProfileImage/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username: username });  // Use username for the query
    if (!user || !user.profileImage) {
      return res.status(404).json({ message: 'Profile image not found' });
    }
    res.json({ profileImage: user.profileImage });
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ message: 'Error fetching profile image' });
  }
});

module.exports = router;
