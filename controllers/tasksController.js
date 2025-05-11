const { connect } = require('mongoose')
const Task = require('../models/Task')

const getAllTasks = async (req, res) => {
    try {
        const findTask = await Task.find()
        console.log(findTask)
        res.status(200).json(findTask)
    } catch (error) {
        console.log(error)
    }
}

const getSpecificTask = async (req, res) => {
    try{
        const id = req.params.taskID
        const value = await Task.findById(id).exec()
        console.log(id)
        console.log(value)
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
        const { id } = req.params.taskID;
        const taskUpdate = await Task.findOneAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        console.log(req.body)
        res.status(200).json({taskUpdate})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllTasks,
    getSpecificTask,
    insertNewTask,
    updateTask,
    deleteTask
}