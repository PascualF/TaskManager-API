import Task from '../models/Task.js'

export const getAllTasks = async (req, res) => {
    const userId = req.query
    try {
        const findTask = await Task.find({ userId })
        res.status(200).json(findTask)
    } catch (error) {
        res.status(500).json({ error: `Something went wrong` })
    }
}

export const getSpecificTask = async (req, res) => {
    try{
        const id = req.params.taskID
        const value = await Task.findById(id).exec()
        res.status(200).json(value)
    } catch (error) {
        console.log(error)
    }
}

export const insertNewTask = async (req, res) => {
    console.log(req.body)
    try{
        const { title, content, status, date, dueDate, priority, userId } =  req.body
        const task = await Task.create({
            title,
            content,
            status,
            date,
            dueDate,
            priority,
            userId
        })
        res.status(201).json({ task })
    } catch (error) {
        console.log(error)
    }
}

export const deleteTask = async(req, res) => {
    try{
        const id = req.params.taskID;
        const taskDelete = await Task.deleteOne({ "_id": id})
        res.status(200).json({ taskDelete })
    } catch (error) {
        console.log(error)
    }
}

export const updateTask = async (req, res) => {
    try{
        const id  = req.params.taskID;
        const taskUpdate = await Task.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })

        if(!taskUpdate) {
            return res.status(404).json({ msg: 'Task not found '}) 
        }

        res.status(200).json({ taskUpdate })
    } catch (error) {
        console.log(error)
    }
}