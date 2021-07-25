//step 1: import mongoose 
const mongoose = require('mongoose');

// step 2: import schema using mongoose
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: { 
    type: String,
    require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', UserSchema);

