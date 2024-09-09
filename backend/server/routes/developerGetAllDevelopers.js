const express = require("express");
const router = express.Router();
const developers = require('../models/developersModel')

router.get('/getAll', async (req, res) => {

    const devs = await developers.find();
    return res.json(devs)
    
  })
  module.exports = router;