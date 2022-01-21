const mongoose = require("mongoose");
const Schema = mongoose.Schema

const taskSchema = new Schema(
    {
        name: String,
        description: String,
        type: String,
        status: String,
    },
    { timestamps: true },
    { typeKey: '$type '}
);

const TaskModel = mongoose.model("task", taskSchema)
module.exports = TaskModel