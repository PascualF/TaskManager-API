const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://pascualfelicio:Felicio_44742@taskmanagerapi.luzjxt4.mongodb.net/")
    } catch (error) {
        console.log(error)
    }
}
    

module.exports = connectDB;