// POST /images/create – Upload a general image.
// POST /profile/upload – Upload a profile image and replace the old one.
// POST /profile/remove – Remove a profile image and reset to the default.
// DELETE /images/:imageKey – Delete a specific image from S3

const express = require('express');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const router = express.Router();
const imageSchema = require('../models/imageModel');
const User = require('../models/userModel'); // Import the user model

// Configure AWS SDK with your credentials and region
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer to store the file in memory
const upload = multer({ storage: multer.memoryStorage() });

// Route to handle post image upload
router.post('/images/create', upload.single('image'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  if (!req.body.name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const imageUri = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  console.log(process.env.S3_BUCKET_NAME, process.env.AWS_REGION);


  try {
    await s3Client.send(new PutObjectCommand(params));

    const newImage = new imageSchema({
      name: req.body.name,
      uri: imageUri,
    });

    await newImage.save();

    res.json({
      message: 'Image uploaded successfully',
      imageUri,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image', error });
  }
});

// Route to handle profile image upload and replace old image
router.post('/profile/upload', upload.single('profileImage'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No profile image file provided' });
  }

  if (!req.body.name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const user = await User.findOne({ username: req.body.name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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

    if (previousImageUri && previousImageUri !== newImageUri && !previousImageUri.includes('ProfileIcon.png')) {
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
        console.warn('Error deleting old profile image from S3:', error.message);
      }
    }

    res.json({
      message: 'Profile image uploaded successfully',
      imageUri: newImageUri,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload profile image', error });
  }
});

// Route to handle profile image removal
router.post('/profile/remove', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const user = await User.findOne({ username: req.body.name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const previousImageUri = user.profileImage;
    const defaultProfileImageUrl = 'https://your-bucket-name.s3.amazonaws.com/profilepictures/ProfileIcon.png';
    user.profileImage = defaultProfileImageUrl;
    await user.save();

    if (previousImageUri && !previousImageUri.includes('ProfileIcon.png')) {
      try {
        const oldProfileImageUrl = new URL(previousImageUri);
        const oldKey = oldProfileImageUrl.pathname.substring(1);

        if (oldKey) {
          const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAMEE,
            Key: oldKey,
          };

          await s3Client.send(new DeleteObjectCommand(deleteParams));
        }
      } catch (error) {
        console.warn('Error deleting profile image from S3:', error.message);
      }
    }

    res.json({
      message: 'Profile image removed and reset to default successfully',
      profileImage: defaultProfileImageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove profile image', error });
  }
});

// Route to handle image deletion
router.delete('/images/:imageKey', async (req, res) => {
  const { imageKey } = req.params;

  const deleteParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: imageKey,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image', error });
  }
});

module.exports = router;
