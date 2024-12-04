const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel');

// Route to update hobbies after user registration
router.patch('/userUpdateHobbies', async (req, res) => {
    try {
        const { userId, hobbies } = req.body; // Retrieve userId and hobbies from the request body

        // Ensure hobbies array has at least 3 hobbies
        if (!hobbies || hobbies.length < 3) {
            return res.status(400).json({ message: "Please select at least 3 hobbies." });
        }

        // Find and update the user's hobbies
        const user = await newUserModel.findByIdAndUpdate(userId, { hobbies }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ message: "Hobbies updated successfully!", user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
