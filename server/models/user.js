const mongoose = require('mongoose');

var User = mongoose.model('user', {
    email: {
        required: true,
        trim: true,
        minlength: 3,
        type: String,
        lowercase: true
    }
});

module.exports = {User};