const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

    name: String,

    deadline: String,

    priority: Number,

    done: {
        type: Boolean,
        default: false
    },

    userEmail: String
});

module.exports =
    mongoose.model('Task', taskSchema);