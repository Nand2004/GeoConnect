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

    const { username, email, password, latitude, longitude } = req.body;

    // Check if username already exists
    const user = await newUserModel.findOne({ username: username });
    if (user) return res.status(409).send({ message: "Username is taken, pick another" });

    // Generate the hash
    const generateHash = await bcrypt.genSalt(Number(10));

    // Parse the generated hash into the password
    const hashPassword = await bcrypt.hash(password, generateHash);

    // Create a new user with dynamic location
    const createUser = new newUserModel({
        username: username,
        email: email,
        password: hashPassword,
        location: {
            type: 'Point',
            coordinates: latitude && longitude ? [parseFloat(longitude), parseFloat(latitude)] : null,
        },
    });

    try {
        const saveNewUser = await createUser.save();
        res.send(saveNewUser);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new user" });
    }
});

module.exports = router;
