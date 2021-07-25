//step 1: import mongoose 
const mongoose = require('mongoose');

// step 2: import schema using mongoose
const ContactSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: { 
    type: String,
    required: true
    },
    type: {
        type: String,
        default: 'Personal'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('contact', ContactSchema);

