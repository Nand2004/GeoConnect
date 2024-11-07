const express = require('express');
const router = express.Router();
const imageSchema = require('../../models/imageModel');

// Route to delete an image by ID
router.delete('/:id', async (req, res) => {
    try {
        await imageSchema.findByIdAndRemove(req.params.id);
        res.json({ message: 'Image removed successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
