var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var portfolioModel = require("../public/models/portfolio");
var data = require("../public/Controller/GetData.js");
data1 = new data();

async function updatePortfolio(
  previousPortfolio,
  stockName,
  quantity,
  total,
  res
) {
  previousQuantity = previousPortfolio.quantity;
  const newQuantity = quantity + previousQuantity;
  previousTotal = total;
  const stockDetails = await data1.getData(stockName);
  const currentPrice = stockDetails.price;

  const updatedPortfolio = {
    username: previousPortfolio.username,
    stockName: stockName,
    quantity: newQuantity,
    total: previousTotal + currentPrice * quantity
  };

  console.log("updatedPortfolio" + JSON.stringify(updatedPortfolio));
  var options = { new: true, useFindAndModify: false };

  portfolioModel.findOneAndUpdate(
    { username: previousPortfolio.username, stockName: stockName },
    updatedPortfolio,
    options,
    function(err, updatedvalue) {
      if (err) {
        res.json({ success: false, msg: err });
        console.log("got an error" + err);
      } else {
        console.log(updatedvalue + "inserted documebnt");
        res.json({ success: true });
      }
    }
  );
}

async function createNewPortfolio(username, stockName, quantity, res) {
  console.log("stockName is" + stockName);
  const stockDetails = await data1.getData(stockName);
  const price = stockDetails.price;
  const total = price * quantity;
  console.log("stockDetails" + JSON.stringify(stockDetails));
  console.log("price" + JSON.stringify(price));
  console.log("total" + JSON.stringify(total));

  console.log("total is" + total);
  const newPortfolio = {
    username: username,
    stockName: stockName,
    quantity: quantity,
    total: total
  };

  portfolioModel.create(newPortfolio, function(err, newlyInserted) {
    if (err) {
      res.json({ success: false, msg: err });
      console.log(err);
    } else {
      console.log(newlyInserted + "inserted documebnt");
      res.json({ success: true });
    }
  });
}

router.post("/insert", async function(req, res, next) {
  const previousPortfolio = await portfolioModel.findOne({
    username: req.body.username,
    stockName: req.body.stockName
  });
  console.log("previousPortfolio is" + previousPortfolio);
  if (previousPortfolio !== null) {
    console.log("in update");

    await updatePortfolio(
      previousPortfolio,
      req.body.stockName,
      req.body.quantity,
      previousPortfolio.total,
      res
    );
  } else {
    console.log("in create");
    await createNewPortfolio(
      req.body.username,
      req.body.stockName,
      req.body.quantity,
      res
    );
  }
});

router.get("/:userid", async function(req, res, next) {
  /*await User.findOne({ email: req.params.userid}).then(user => {
    if(user)
    {
      console.log('User is found');
    }
    else{
      return res
            .status(400)
            .json({ userfound: "User not found" });
        }
      });
});*/
  const portfolio_temp = await portfolioModel.find({
    username: req.params.userid,
    function(err, foundUser) {
      if (err) {
        res.json({ success: false, msg: err });
      } else {
        res.json({ success: true, msg: "User Found" });
        console.log("user is" + foundUser);
      }
    }
  });
  if (portfolio_temp.length === 0) {
    return res.status(400).json({ portFolioLength: "portfolio is empty" });
  }
  portfolio_temp.forEach(function(element) {
    element.total = element.total.toFixed(2)
    console.log("element is " + element);
  });
  res.send(portfolio_temp);
});

module.exports = router;
