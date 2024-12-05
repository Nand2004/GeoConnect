const express = require("express");
const router = express.Router();
const z = require('zod');
const bcrypt = require("bcrypt");
const { newUserValidation } = require('../../models/userValidator');
const newUserModel = require('../../models/userModel');

router.post('/signup', async (req, res) => {
    const { error } = newUserValidation(req.body);
    console.log(error);
    if (error) return res.status(400).send({ message: error.errors[0].message });

    const { username, email, password, latitude, longitude, hobbies } = req.body;

    // Validate hobbies (should be an array with at least 3 items)
    if (!hobbies || hobbies.length < 3) {
        return res.status(400).send({ message: "Please select at least 3 hobbies." });
    }

    // Check if username already exists
    const user = await newUserModel.findOne({ username: username });
    if (user) return res.status(409).send({ message: "Username is taken, pick another" });

    // Check if username already exists
    const userEmail = await newUserModel.findOne({ email : email });
    if (userEmail) return res.status(409).send({ message: "Account already exists ! Please login ! " })


    // Generate the hash
    const generateHash = await bcrypt.genSalt(Number(10));

    // Parse the generated hash into the password
    const hashPassword = await bcrypt.hash(password, generateHash);

    // Create a new user with dynamic location and hobbies
    const createUser = new newUserModel({
        username: username,
        email: email,
        password: hashPassword,
        location: {
            type: 'Point',
            coordinates: latitude && longitude ? [parseFloat(longitude), parseFloat(latitude)] : null,
        },
        hobbies: hobbies, // Store hobbies as an array
    });

    try {
        const saveNewUser = await createUser.save();
        res.send(saveNewUser);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new user" });
    }
});

module.exports = router;
