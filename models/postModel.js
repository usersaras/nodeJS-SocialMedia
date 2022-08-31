const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    post: String,
    postedByID: String,
    postedByName: String,
    postImage: String,
    postLikes: String
}, {timestamps: true});

const userModel = mongoose.model('posts', postSchema);

module.exports = userModel;