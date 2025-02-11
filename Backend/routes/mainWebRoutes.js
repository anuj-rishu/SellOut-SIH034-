const express = require('express');
const router = express.Router();
const { getAllProfiles} = require('../controllers/mainWebProController');

router.get('/admins/profile', getAllProfiles)

module.exports = router;