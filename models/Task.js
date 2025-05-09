const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true}
})

module.exports = mongoose.model('Task', taskSchema);