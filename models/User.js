const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
    },
    password: {
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);