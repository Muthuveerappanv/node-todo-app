const mongoose = require('mongoose');

var Todo = mongoose.model('todo', {
    text: {
        required: true,
        type: String,
        minlength: 3,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    }
});

module.exports = { Todo };