var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.Object,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", CommentSchema);