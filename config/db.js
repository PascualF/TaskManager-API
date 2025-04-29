const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.ATLAS_PW)
        console.log('connected to mongoDB')
    } catch (error) {
        console.log(error)
    }
}
    

module.exports = connectDB;