const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: String,
    deadline: Date,
    priority: Number,
    done: { type: Boolean, default: false }
});

module.exports = mongoose.model('Task', taskSchema);