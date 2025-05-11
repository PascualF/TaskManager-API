const express = require('express')
const router = express.Router();

const {
    getAllTasks,
    getSpecificTask,
    insertNewTask,
    updateTask,
    deleteTask
} = require('../controllers/tasksController.js')

router.get('/tasks', getAllTasks)

router.get('/tasks/:taskID', getSpecificTask)

router.post('/tasks', insertNewTask) // Sending back to Homepage

router.patch('/tasks/:taskID', updateTask)

router.delete('/tasks/:taskID', deleteTask)

module.exports = router