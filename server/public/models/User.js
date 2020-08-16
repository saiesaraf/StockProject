var mongoose = require('mongoose');
var User = mongoose.Schema(
    {
        name: String,
        email: String,
        password: String
    });

    module.exports = mongoose.model("User", User);