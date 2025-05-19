const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema(
    {
        title: {
            type: String, 
            required: true
        },
        content: {
            type: String, 
            required: true
        },
        status : {
            type: String,
            enumValues: ["todo", "in progress", "done"],
            default: "todo"
        },
        date: { 
            type: Date,
            default: Date.now 
        },
        dueDate : {
            type: Date
        },
        priority : {
            type: String,
            enumValues: ["low", "medium", "high"],
            default: "medium"
        }/* ,
        user: [{ type: Schema.Types.ObjectId, ref: "User" }] */
    }
)

module.exports = mongoose.model('Task', taskSchema);