const express = require('express');
const router = express.Router();
const imageSchema = require('../../models/imageModel');

// Route to retrieve all images
router.get('/getAll', async (req, res) => {
    try {
        const data = await imageSchema.find({});
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching all images:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
