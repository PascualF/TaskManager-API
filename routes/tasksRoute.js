const express = require('express')
const router = express.Router();

const {
    getAllTasks,
    getSpecificTask
} = require('../controllers/tasksController.js')

router.get('/tasks', getAllTasks)

router.get('/tasks/:taskID', getSpecificTask)

module.exports = router