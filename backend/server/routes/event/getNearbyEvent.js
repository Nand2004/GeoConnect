const express = require("express");
const router = express.Router();
const Event = require("../../models/eventModel");

router.get("/getNearbyEvents", async (req, res) => {
  const { 
    longitude, 
    latitude, 
    radius = 10,  // Default radius in km
    categories,   // Comma-separated categories
    minAttendees = 0, 
    maxAttendees = 100,
    sortBy = 'nearest',
    searchQuery = ''
  } = req.query;

  try {
    // Validate required location parameters
    if (!longitude || !latitude) {
      return res.status(400).json({ message: "Missing required location parameters" });
    }

    // Base query for geospatial search
    const query = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(longitude), parseFloat(latitude)], 
            radius / 3963.2  // Convert radius to radians (Earth's radius in miles)
          ],
        },
      }
    };

    // Category filter
    if (categories && categories.length) {
      query.category = { $in: categories.split(',') };
    }

    // Attendees range filter
    query['$expr'] = {
      $and: [
        { $gte: [{ $size: "$attendees" }, Number(minAttendees)] },
        { $lte: [{ $size: "$attendees" }, Number(maxAttendees)] }
      ]
    };

    // Search query filter
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Fetch events with the applied filters
    let events = await Event.find(query);

    // Sorting logic
    switch (sortBy) {
      case 'mostPopular':
        events.sort((a, b) => b.attendees.length - a.attendees.length);
        break;
      case 'soonest':
        events.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        break;
      case 'nearest':
      default:
        // Already sorted by proximity due to $geoWithin
        break;
    }

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching nearby events:", error);
    return res.status(500).json({ message: "Server error while fetching nearby events" });
  }
});

module.exports = router;