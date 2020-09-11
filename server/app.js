var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var stockRouter = require("./routes/getStock");
var portfolioRouter = require("./routes/PortfolioRouter");
var userRouter = require("./routes/users");
var historyRouter = require("./routes/getHistorical");
var transactionRouter = require("./routes/getTransactions");
var companyRouter = require("./routes/getCompanies");
var app = express();
const mongoose = require("mongoose");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/stocks", stockRouter);
app.use("/portfolio", portfolioRouter);
app.use("/user", userRouter);
app.use("/history", historyRouter);
app.use("/transactions", transactionRouter);
app.use("/companies",companyRouter);
mongoose.connect(
  "mongodb+srv://saiesaraf:April@2020@cluster0-5czsu.mongodb.net/stocks?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
);
module.exports = app;
