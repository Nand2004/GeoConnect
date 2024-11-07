const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const imageSchema = require('../../models/imageModel');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now())
});
const upload = multer({ storage });

// Route to create and upload a new image
router.post('/add', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const directoryAbove = path.resolve(__dirname, '../..');
    const pathToUploadedFile = path.join(directoryAbove, 'uploads', req.file.filename);
    const base64Data = fs.readFileSync(pathToUploadedFile, { encoding: 'base64' });

    const imageToStore = new imageSchema({
        name: req.body.name,
        base64Data: base64Data,
        img: {
            data: fs.readFileSync(pathToUploadedFile),
            contentType: req.file.mimetype // Set content type dynamically
        }
    });

    try {
        const response = await imageSchema.create(imageToStore);
        res.json({ msg: 'Image added successfully.', imageId: response._id });
    } catch (error) {
        console.error('Error creating image:', error);
        res.status(500).json({ msg: 'Could not add image', error: error.message });
    } finally {
        fs.unlink(pathToUploadedFile, (err) => {
            if (err) console.error('Error deleting file:', err);
            else console.log('File deleted successfully.');
        });
    }
});

module.exports = router;
