const express = require("express");
const router = express.Router();
const chatModel = require('../../models/chatModel');

// Route to delete a specific chat by chat ID
router.delete('/deleteChat/:chatId', async (req, res) => {
    const { chatId } = req.params;

    try {
        const deletedChat = await chatModel.findByIdAndDelete(chatId);
        if (!deletedChat) {
            return res.status(404).json({ message: "Chat not found." });
        }
        return res.status(200).json({ message: "Chat deleted successfully." });
    } catch (error) {
        console.error("Error deleting chat:", error);
        return res.status(500).json({ message: "Error deleting chat." });
    }
});

module.exports = router;
