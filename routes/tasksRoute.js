const express = require('express')
const router = express.Router();

const {
    getAllTasks,
    getSpecificTask,
    insertNewTask,
    updateTask,
    deleteTask
} = require('../controllers/tasksController.js')

const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

router.route('/tasks').get(getAllTasks).post(insertNewTask)
router.route('/tasks/:taskID').get(getSpecificTask).patch(updateTask).delete(deleteTask)

module.exports = router