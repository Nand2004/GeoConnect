// Upload a general image
// POST
// routes/images/imagesCreate.js

const express = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const router = express.Router();
const imageSchema = require("../../models/imageModel");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/createImage", upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  if (!req.body.name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const imageUri = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

  try {
    await s3Client.send(new PutObjectCommand(params));

    const newImage = new imageSchema({
      name: req.body.name,
      uri: imageUri,
    });

    await newImage.save();

    res.json({
      message: "Image uploaded successfully",
      imageUri,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload image", error });
  }
});

module.exports = router;
