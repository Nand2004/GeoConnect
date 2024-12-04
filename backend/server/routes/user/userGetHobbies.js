// routes/users/getHobbies.js
const express = require('express');
const newUserModel = require('../../models/userModel');
const router = express.Router();

router.get('/userGetHobbies/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user and return their hobbies
    const user = await newUserModel.findById(userId).select('hobbies');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ hobbies: user.hobbies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
});

module.exports = router;
