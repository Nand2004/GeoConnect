const express = require("express");
const router = express.Router();
const editRatingModel = require('../models/userRatings')

router.post('/editRatings', async (req, res) => {
    const { _id, username, stationName, ratings, comments, Date } = req.body;

    try {
      await editRatingModel.findByIdAndUpdate(_id, {
        ratings : ratings,
        comments: comments,
        Date : Date,
      });
      res.status(200).send('Rating updated successfully');
    } catch (err) {
      console.log(err);
      res.status(500).send('Error updating rating');
    }
  });

module.exports = router;