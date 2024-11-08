// Upload a profile image and replace the old one
// POST
// routes/images/profileImageUpload.js

const express = require("express");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const router = express.Router();
const User = require("../../models/userModel");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/profileImageUpload", upload.single("profileImage"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No profile image file provided" });
  }

  if (!req.body.name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const user = await User.findOne({ username: req.body.name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newKey = `profilepictures/${Date.now()}_${file.originalname}`;
    const newImageUri = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newKey}`;

    const previousImageUri = user.profileImage;
    user.profileImage = newImageUri;
    await user.save();

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: newKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    if (previousImageUri && previousImageUri !== newImageUri && !previousImageUri.includes("ProfileIcon.png")) {
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
        console.warn("Error deleting old profile image from S3:", error.message);
      }
    }

    res.json({
      message: "Profile image uploaded successfully",
      imageUri: newImageUri,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload profile image", error });
  }
});

module.exports = router;
