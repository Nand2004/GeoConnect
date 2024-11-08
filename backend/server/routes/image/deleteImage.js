// Delete a specific image from S3
// DELETE
// routes/images/imageDelete.js

const express = require("express");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const router = express.Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.delete("/deleteImage/:imageKey", async (req, res) => {
  const { imageKey } = req.params;

  const deleteParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: imageKey,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image", error });
  }
});

module.exports = router;
