const mongoose = require("mongoose");

//user schema/model
const ratingSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    stationName: {
      type: String,
      required: true,
      label: "stationName",
    },
    ratings: {
      type: Number,
      required: true,
      label: "ratings",
    },
    comments: {
      required: true,
      type: String,
      label: "comments ",
    },
    date: {
      type: Date,
      default: Date.now,
      label: "date",
    },
  },
  { collection: "ratings" }
);

module.exports = mongoose.model('ratings', ratingSchema)