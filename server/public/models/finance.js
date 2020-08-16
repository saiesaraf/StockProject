var mongoose = require('mongoose');

var stockData = mongoose.Schema({
    stockName: String,
    date: String,
    close: String
});

module.exports = mongoose.model("stocks", stockData)