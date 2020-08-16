var mongoose = require('mongoose');
var portfolio = mongoose.Schema(
    {
        username: String,
        date: Date,
        stockName: String,
        quantity: Number,
        total: Number,
    });
    

    module.exports = mongoose.model("portfolio", portfolio);
