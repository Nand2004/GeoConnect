const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel');

router.get('/locationGetNearby', async (req, res) => {
  const { latitude, longitude, distance, hobbies } = req.query;

  try {
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const radius = distance ? parseFloat(distance) : 5000;

    // Create query object for location
    const query = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius
        }
      }
    };

    // If hobbies are provided, add hobby filter to query
    if (hobbies) {
      const hobbyArray = typeof hobbies === 'string' 
        ? hobbies.split(',') 
        : hobbies;
      
      query.hobbies = { 
        $all: hobbyArray // Ensures ALL selected hobbies are present
      };
    }

    const locations = await newUserModel.find(query, { 
      location: 1, 
      username: 1, 
      email: 1,
      hobbies: 1 
    });

    // Important error handling for no users with specified hobbies
    if (!locations || locations.length === 0) {
      // Differentiate between no nearby users and no users with specified hobbies
      if (hobbies) {
        return res.status(404).json({ 
          message: "No users found with the specified hobbies in the selected area",
          hobbies: hobbies.split(',')
        });
      }
      
      return res.status(404).json({ message: "No nearby locations found" });
    }

    return res.json(locations);
  } catch (error) {
    console.error("Error fetching nearby locations:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
