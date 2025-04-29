const Task = require('../models/Tasks')

const getAllTasks = async (req, res) => {
    try {
        const findTask = await Task.find()
        console.log(findTask)
        res.status(200).json(findTask)
    } catch (error) {
        console.log(error)
    }
}

const getSpecificTask = (req, res) => {
    res.send('Getting just one tasks, this needs a ID.')
}

const insertNewTasks = (req, res) => {
    res.send('this is the post new task')
}

module.exports = {
    getAllTasks,
    getSpecificTask,
    insertNewTasks
}