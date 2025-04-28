const getAllTasks = (req, res) => {
    res.send('Getting all tasks')
}

const getSpecificTask = (req, res) => {
    res.send('Getting just one tasks, this needs a ID.')
}

module.exports = {
    getAllTasks,
    getSpecificTask
}