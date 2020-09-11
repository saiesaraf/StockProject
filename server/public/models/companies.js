var mongoose = require('mongoose');
var companies = mongoose.Schema(
    {
       Symbol: String,
       Name: String
    });
    

module.exports = mongoose.model("companies", companies);