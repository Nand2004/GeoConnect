const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel');

// Query Parameters: The route expects latitude, longitude, and optionally distance in the request query.
// Geospatial Query: It uses MongoDB’s $nearSphere to find nearby users within a given radius.

// Route to get nearby locations based on longitude and latitude
router.get('/locationGetNearby', async (req, res) => {
  const { latitude, longitude, distance } = req.query; // Distance in meters

  try {
    // Ensure latitude and longitude are provided
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // Default distance if not provided (e.g., 5000 meters = 5 km)
    const radius = distance ? parseFloat(distance) : 5000;

    // Find locations within the given distance
    const locations = await newUserModel.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius
        }
      }
    }, { location: 1, username: 1, email: 1 });

    if (!locations || locations.length === 0) {
      return res.status(404).json({ message: "No nearby locations found" });
    }

// Result: Returns nearby users' locations, usernames, and emails
    return res.json(locations); 
  } catch (error) {
    console.error("Error fetching nearby locations:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
