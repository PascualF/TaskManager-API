const Task = require('../models/Task')

const getAllTasks = async (req, res) => {
    try {
        const findTask = await Task.find()
        res.status(200).json(findTask)
    } catch (error) {
        console.log(error)
    }
}

const getSpecificTask = async (req, res) => {
    try{
        const id = req.params.taskID
        const value = await Task.findById(id).exec()
        res.status(200).json(value)
    } catch (error) {
        console.log(error)
    }
}

const insertNewTask = async (req, res) => {
    try{
        const { title, content, status, date, dueDate, priority} =  req.body
        const task = await Task.create({
            title,
            content,
            status,
            date,
            dueDate,
            priority
        })
        res.status(201).json({ task })
    } catch (error) {
        console.log(error)
    }
}

const deleteTask = async(req, res) => {
    try{
        const id = req.params.taskID;
        const taskDelete = await Task.deleteOne({ "_id": id})
        res.status(200).json({ taskDelete })
    } catch (error) {
        console.log(error)
    }
}

const updateTask = async (req, res) => {
    try{
        const id  = req.params.taskID;
        const taskUpdate = await Task.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })

        if(!taskUpdate) {
            // When not     
            return res.status(404).json({ msg: 'Task not found '}) 
        }

        res.status(200).json({ taskUpdate })
    } catch (error) {
        console.log(error)
    }
}

// The auth is verified in the route.
module.exports = {
    getAllTasks,
    getSpecificTask,
    insertNewTask,
    updateTask,
    deleteTask
}