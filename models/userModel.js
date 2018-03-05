var mongoose = require("mongoose");
var passportLocal = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocal);

module.exports = mongoose.model("User", UserSchema);