const express = require('express');
const router = express.Router();
const userLocation = require('../models/userLocation');

// Endpoint to update user's location
router.post('/api/location/update', async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  try {
    const user = await userLocation.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    await user.save();
    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
