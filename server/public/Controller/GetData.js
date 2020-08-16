var request = require("request-promise");
var mongoose = require("mongoose");
var stockModel = require("../models/finance");
var historicalstockModel = require("../models/historicalStocks");
var moment = require("moment"); // require

// Compile model from schema
module.exports = class GetData {
  constructor() {
    this.currentStockUrl = "https://cloud.iexapis.com/stable/stock/";
    this.token2 = "pk_2a31e3bddf2641e4b9e88dfb22e350dd";
    this.historicalUrl = "https://cloud.iexapis.com/stable/stock/";
  }

  async getDatefromstocksDB(stock) {
    const allStocks = await stockModel.find({ stockName: stock }).sort("-date");

    console.log("stock" + JSON.stringify(allStocks));
    if (allStocks[0] == undefined) {
      return null;
    }
    return allStocks[0].date;
  }

  async getLatestStockFromDb(stock) {
    const stockCapital = stock.toUpperCase();
    const stocks = await stockModel
      .find({
        stockName: stockCapital
      })
      .sort("-date");

    if (stocks !== undefined) return stocks[0];
    return stocks;
  }

  async getStockFromDb(stock) {
    //const datetime = new Date();
    //const todaysDate = datetime.toISOString().slice(0, 10);
    const latestDate = await this.getDatefromstocksDB(stock);
    //console.log("latest Date is" + latestDate);
    const stockCapital = stock.toUpperCase();
    const stocks = await stockModel.findOne({
      stockName: stockCapital,
      date: latestDate
    });

    return stocks;
  }

  parseData(stockData) {
    const requiredData = [];
    stockData = JSON.parse(stockData);
    const stock = stockData.symbol;
    const close = stockData.latestPrice;
    const curDate = stockData.latestTime;
    var curDateFormatted = moment(curDate, "MMMM DD, YYYY").format(
      "YYYY-MM-DD"
    );
    //var curDateFormatted = moment("August 7, 2020",).format("YYYY-MM-DD");
    //console.log("curDate formatted one is " + curDateFormatted);
    const newStock = {
      stockName: stock,
      date: curDateFormatted,
      close: close
    };
    requiredData.push(newStock);
    //}

    return newStock;
  }

  async storeStock(stock) {
    const stockDetails = await stockModel.find({
      stockName: stock.stockName,
      date: stock.date
    });
    //console.log("stockDetails from DB are :" + stockDetails);
    if (!stockDetails || stockDetails.length == 0)
      await stockModel.create(stock);
    else {
      await stockModel.updateOne(stock, {
        stockName: stock.stockName,
        date: stock.date
      });
    }
    //previous logic is :
    /* try {
      await stockModel.create(stock);
    } catch (err) {
      console.log("Error storing in database" + err);
    }*/
  }
  async getStockFromRequest(stock) {
    const completeUrl =
      this.currentStockUrl + stock + "/quote?token=" + this.token2;
    //console.log("Url is" + completeUrl);
    try {
      let stockData = await request(completeUrl);
      //console.log("stockData is" + stockData);
      stockData = this.parseData(stockData);
      console.log(
        "stockData after parsing is" +
          stockData.stockName +
          stockData.date +
          stockData.close
      );
      await this.storeStock(stockData);
    } catch (err) {
      console.log("Error in getting stock from api" + err);
    }
  }

  getDifference(a, b) {
    //console.log("a ===" + JSON.stringify(a));
    //console.log("b ===" + JSON.stringify(b));

    const dateA = new Date(a);
    const dateb = new Date(b);

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(
      dateA.getFullYear(),
      dateA.getMonth(),
      dateA.getDate()
    );
    const utc2 = Date.UTC(
      dateb.getFullYear(),
      dateb.getMonth(),
      dateb.getDate()
    );
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;

    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
  }

  async getData(stock) {
    stock = stock.toUpperCase();
    let latestDateDB = await this.getDatefromstocksDB(stock);
    console.log("latest date is from getData" + latestDateDB);
    if (latestDateDB == null) {
      await this.getStockFromRequest(stock);
      let stockFromDb = await this.getLatestStockFromDb(stock);

      return {
        price: stockFromDb.close
      };
    } else {
      var todaysDate = moment().format("YYYY-MM-DD");
      console.log("Todays date is" + todaysDate);
      var diff = this.getDifference(todaysDate, latestDateDB);

      //console.log("Difference is" + diff);
      if (diff > 0) {
        await this.getStockFromRequest(stock);
      }
      let stockFromDb = await this.getStockFromDb(stock);
      return {
        price: stockFromDb.close
      };
    }
  }

  /*To get and store historical data */

  async getDatefromDB(stock) {
    const allStocks = await historicalstockModel
      .find({ stockName: stock })
      .sort("-date");
    return allStocks[0].date;
  }
  parseHistoricalData(historicalData, stockSymbol) {
    const requiredHistoricalData = [];
    historicalData = JSON.parse(historicalData);

    for (const curr of historicalData) {
      const stock = stockSymbol;
      const close = curr.close;
      const date = curr.date;
      const newStock = {
        stockName: stock,
        date: date,
        close: close
      };
      requiredHistoricalData.push(newStock);
    }

    return requiredHistoricalData;
  }

  async storeHistoricalStock(stockData) {
    const stockDetails = await historicalstockModel.find({
      stockName: stockData.stockName,
      date: stockData.date
    });
    if (!stockDetails || stockDetails.length == 0)
      historicalstockModel.create(stockData);
    else
      historicalstockModel.updateOne(stockData, {
        stockName: stockData.stockName,
        date: stockData.date
      });
  }

  async getHistoricalDB(stock) {
    const dataFromDB = historicalstockModel
      .find({ stockName: stock })
      .sort("-date")
      .exec(function(err, doc) {});
    return dataFromDB;
  }
  dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
  async getHistoricalApi(stock, dateFrom, dateTo) {
    var historicalData1 = [];
    const a = new Date(dateFrom);
    const b = new Date(dateTo);
    //console.log("a date is" + a);
    //console.log("b date is" + b);
    const difference = this.dateDiffInDays(a, b);
    var Url = "";
    //console.log("Difference in days is" + difference);
    if (difference === 30) {
      Url =
        this.historicalUrl + stock + "/chart" + "/3m" + "?token=" + this.token2;
    } else if (difference > 30) {
      Url =
        this.historicalUrl + stock + "/chart" + "/3m" + "?token=" + this.token2;
    } else {
      Url =
        this.historicalUrl + stock + "/chart" + "/5d" + "?token=" + this.token2;
    }

    //console.log("url iss = " + Url);
    try {
      let stockDataHistorical = await request(Url);
      stockDataHistorical = this.parseHistoricalData(
        stockDataHistorical,
        stock
      );
     // console.log("here1");
      for (const stock of stockDataHistorical) {
        await this.storeHistoricalStock(stock);
      }
      return stockDataHistorical;
    } catch (err) {
      console.log("Error in getting stock from api" + err);
    }
  }

  async getHistoricalData(stock) {
    var historicalDataReturned = [];
    var todaysDate = moment().format("YYYY-MM-DD");
    //console.log("Date using Moment is" + todaysDate);

    var threeMonthsAgo = moment().subtract(3, "months");
    const date3Month = moment(threeMonthsAgo).format("YYYY-MM-DD");
    //console.log("3 months ago " + date3Month);

    var historicalData = await this.getHistoricalDB(stock);
    //check if DB is empty:
    if (historicalData == undefined || historicalData.length == 0) {
      historicalData = await this.getHistoricalApi(
        stock,
        date3Month,
        todaysDate
      );
      historicalDataReturned = historicalData;
    } else {
      const latestDate = await this.getDatefromDB(stock);
      var yesterday = moment().subtract(1, "day");
      //console.log("one day before today is" + yesterday.format("YYYY-MM-DD"));
      //console.log("Date from DB is " + latestDate);
      if (latestDate === todaysDate) {
        console.log("here we will get data from DB");
        historicalData = await this.getHistoricalDB(stock);
        historicalDataReturned = historicalData;
      } else {
        historicalData = await this.getHistoricalApi(
          stock,
          latestDate,
          todaysDate
        );
        historicalDataReturned = historicalData;
      }
    }
    return historicalDataReturned;
  }
};
