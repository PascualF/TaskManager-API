const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
    title: String,
    content: String
})

module.exports = taskSchema;