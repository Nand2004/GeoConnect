const mongoose = require("mongoose");

//user schema/model
const newUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email uniqueness
      label: "email",
    },
    password: {
      required: true,
      type: String,
      minLength: 8, // Same as your old attribute
    },
    date: {
      type: Date,
      default: Date.now, // Default value preserved
    },
    // Adding the location field
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: false, // Not required initially
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
        default: [0, 0], // Default coordinates (can be updated later)
      },
    },
  },
  { collection: "users" } // Same collection as before
);

// Geospatial index for querying users by location
newUserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('users', newUserSchema);
