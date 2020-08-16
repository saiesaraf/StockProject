var express = require("express");
var router = express.Router();
var data = require("../public/Controller/GetData.js");

dataHistory = new data();

router.get("/historical/:stockName", async (req, res, next) => {
  var historicalData = await dataHistory.getHistoricalData(
    req.params.stockName
  );
  //console.log(historicalData);
  res.send(historicalData);
});

module.exports = router;
