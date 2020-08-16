var mongoose = require('mongoose');

var stockDataHistorical = mongoose.Schema({
    stockName: String,
    date: String,
    close: String
});

module.exports = mongoose.model("historicalStocks", stockDataHistorical)