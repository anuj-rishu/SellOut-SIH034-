const express = require('express');
const taskrouter = express.Router();
const StuTaskController  = require('../controllers/taskController')

taskrouter.post('/submitForm', StuTaskController .submitForm);
  
module.exports = taskrouter