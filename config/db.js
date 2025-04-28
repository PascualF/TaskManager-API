const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://pascualfelicio:glv0BUAAGgXnpiOn@taskmanagerapi.luzjxt4.mongodb.net/")
        console.log('connected on DC')
    } catch (error) {
        console.log(error)
    }
}
    

module.exports = connectDB;