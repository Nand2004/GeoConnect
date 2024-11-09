const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel');

// Route to get a username by their user ID
router.get('/getUsernameByUserId/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Retrieve userId from the URL parameters

        // Find the user by their ID
        const user = await newUserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ username: user.username }); // Return only the username
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
