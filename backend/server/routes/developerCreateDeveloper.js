const express = require("express");
const router = express.Router();
const createDeveloperModel = require('../models/developersModel')

router.post('/add', async (req, res) => {
    

    const { name, role, school } = req.body

    
    //creates a new rating
    const createDeveloper = new createDeveloperModel({
        name: name,
        role: role,
        school: school,
    });

   
    try {
        const saveNewDeveloper = await createDeveloper.save();
        res.send(saveNewDeveloper);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new rating" });
    }

})

module.exports = router;