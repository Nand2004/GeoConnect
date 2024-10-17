const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel');

// Route to search for a user by their username
router.get('/userSearchUser', async (req, res) => {
    try {
        const { username } = req.query;

        // Find user(s) with a username that matches (case-insensitive)
        const user = await newUserModel.find({
            username: { $regex: new RegExp(username, 'i') }
        });

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
