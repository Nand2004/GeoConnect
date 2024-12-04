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
    imageId: {
      type: String,
      label: "imageId",
      required: false,
    },
    profileImage: {
      type: String,
      label: "profileImage",
      required: false,
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
    hobbies: {
      type: [String],
      enum: [
        "Traveling",
        "Photography",
        "Music",
        "Reading",
        "Sports",
        "Gaming",
        "Cooking",
        "Fitness",
        "Art",
        "Writing"
      ],
      required: true,
      validate: [arrayMinLength, 'Please select at least 3 hobbies'],
    },
  },
  { collection: "users" } 
);
function arrayMinLength(val) {
  return val.length >= 3;
}
newUserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('users', newUserSchema);
