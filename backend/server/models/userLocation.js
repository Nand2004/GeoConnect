const mongoose = require("mongoose");

// User schema/model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      label: "email",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        label: "type",
      },
      coordinates: {
        type: [Number],
        required: true,
        label: "coordinates",
      },
    },
  },
  { collection: "location" }
);

// Geospatial index for location queries
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("location", userSchema);
