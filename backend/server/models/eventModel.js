const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name of the event
  },
  description: {
    type: String, // A brief description of the event
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // References the user who created the event
    required: true,
  },
  dateTime: {
    type: Date, // Date and time of the event
    required: true,
  },
  attendees: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // References users attending the event
      },
      joinedAt: {
        type: Date,
        default: Date.now, // Time the user joined
      },
    },
  ],
  category: {
    type: String,
    enum: ["Sports", "Educational", "Job", "Campus_Life", "Concert", "Other"], // Categories to describe the event
    default: "Other",
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chats", // Link to the event's group chat
    default: null, // Placeholder until a chat is created
  },
  imageId: {
    type: String, // Optional image to represent the event
  },
  createdAt: {
    type: Date,
    default: Date.now, // When the event was created
  },
});

eventSchema.index({ location: "2dsphere" }); // Geospatial index for querying events by location

module.exports = mongoose.model("events", eventSchema);
