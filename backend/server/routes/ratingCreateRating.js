const express = require("express");
const router = express.Router();
const createRatingModel = require('../models/userRatings')

router.post('/add', async (req, res) => {
    

    const { username, stationName, ratings, comments, date } = req.body

    
    //creates a new rating
    const createRating = new createRatingModel({
        username: username,
        stationName: stationName,
        ratings: ratings,
        comments: comments,
        date : date,
    });

   
    try {
        const saveNewRating = await createRating.save();
        res.send(saveNewRating);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new rating" });
    }

})

module.exports = router;