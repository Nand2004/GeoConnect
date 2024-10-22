const express = require("express");
const router = express.Router();
const chatModel = require('../../models/chatModel')

router.post('/deleteAll', async (req, res) => {
    const chat = await chatModel.deleteMany();
    return res.json(chat)
  })

  module.exports = router;