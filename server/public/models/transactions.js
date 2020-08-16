var mongoose = require('mongoose');
var transaction = mongoose.Schema(
    {
        username: String,
        stockName: String,
        quantity: Number,
        price: Number,
        total: Number,
        date: String,
        action: String
    });

    module.exports = mongoose.model("transaction", transaction);