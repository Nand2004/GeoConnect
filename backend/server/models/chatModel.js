const mongoose = require("mongoose");

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true, // userId of the sender
  },
  message: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  readBy: [
    {
      user: String,
      readAt: Date,
    },
  ],
  attachments: [
    {
        type: String, // URL or file identifier
        name: String, 
        mimeType: String
    },
  ],
});

// Chat Schema
const chatSchema = new mongoose.Schema(
  {
    chatType: { //Distinguishes between direct and group chats.
      type: String,
      enum: ["direct", "group"],
      required: true,
      default: "direct", // Default is 'direct' for one-on-one chats
    },
    chatName: {
      type: String,
      default: function () {
        return this.chatType === "group" ? "" : undefined; // Only needed for group chats
      },
    },
    users: [
      {
        userId: {
          type: String,
        },
        role: {
          type: String,
          enum: ["member", "admin"],
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    messages: [messageSchema], // Array of messages exchanged between users
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Includes createdAt and updatedAt fields
    collection: "chats", // Collection name
  }
);

// Indexes for efficient querying
chatSchema.index({ "users.userId": 1 });
chatSchema.index({ lastActivity: -1 });

// Model Export
module.exports = mongoose.model("chats", chatSchema);
