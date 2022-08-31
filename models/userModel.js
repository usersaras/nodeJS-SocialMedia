const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    dob: String,
    profilepicture: String,
}, {timestamps: true})

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;