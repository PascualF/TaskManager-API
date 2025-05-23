import mongoose, { model } from 'mongoose';
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
            default: "todo",
            required: true
        },
        date: { 
            type: Date,
            default: Date.now 
        },
        dueDate : {
            type: Date,
            required: true
        },
        priority : {
            type: String,
            enumValues: ["low", "medium", "high"],
            default: "medium",
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    }
)

export default model('Task', taskSchema);