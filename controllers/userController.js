const Task = require('../models/Tasks')

const getUser = async (req, res) => {
    try {
        res.send('User being updated')
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    getUser
}