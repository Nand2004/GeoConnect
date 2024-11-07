const express = require('express');
const router = express.Router();
const imageSchema = require('../../models/imageModel');

// Route to retrieve a specific image by ID
router.get('/:id', async (req, res) => {
    try {
        const image = await imageSchema.findById(req.params.id);
        if (!image) return res.status(404).json({ message: 'Image not found' });

        res.setHeader('Content-Type', image.img.contentType);
        res.send(image.img.data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
