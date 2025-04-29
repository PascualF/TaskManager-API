const Task = require('../models/Task')

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