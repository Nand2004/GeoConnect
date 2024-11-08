// Remove a profile image and reset to the default
// DELETE
// routes/images/profileImageRemove.js

const express = require("express");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const router = express.Router();
const User = require("../../models/userModel");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.delete("/profileImageRemove", async (req, res) => {  // Changed POST to DELETE
  if (!req.body.name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const user = await User.findOne({ username: req.body.name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const previousImageUri = user.profileImage;
    const defaultProfileImageUrl = "https://your-bucket-name.s3.amazonaws.com/profilepictures/ProfileIcon.png";
    user.profileImage = defaultProfileImageUrl;
    await user.save();

    if (previousImageUri && !previousImageUri.includes("ProfileIcon.png")) {
      try {
        const oldProfileImageUrl = new URL(previousImageUri);
        const oldKey = oldProfileImageUrl.pathname.substring(1);

        if (oldKey) {
          const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: oldKey,
          };

          await s3Client.send(new DeleteObjectCommand(deleteParams));
        }
      } catch (error) {
        console.warn("Error deleting profile image from S3:", error.message);
      }
    }

    res.json({
      message: "Profile image removed and reset to default successfully",
      profileImage: defaultProfileImageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove profile image", error });
  }
});

module.exports = router;
