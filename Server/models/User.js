const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Removes any leading or trailing whitespaces
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate emails
        trim: true,
        lowercase: true, // Converts the email to lowercase
    },
    password: {
        select: false,
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date
    }
});

// Create a Mongoose model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
