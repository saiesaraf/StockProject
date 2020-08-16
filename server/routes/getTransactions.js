var express = require('express');
var router = express.Router();
var transactionoModel = require("../public/models/transactions");

router.get('/:userName/:stockName', async function(req, res) {
        transactionoModel.find({
        username: req.params.userName,
        stockName: req.params.stockName
      },
      function (err, foundTransaction) {
        if (err) {
            console.log('I am in error');
          res.json({ success: false, msg: err });
          console.log("Could not get transactions" + err);
         
        } else {
            if(foundTransaction == null || foundTransaction == undefined)
            {
                res.json({ success: false, msg: 'Could not get this transaction!'});
            }
            else{
                res.send(foundTransaction);
            }
         // res.json({ success: true });
        }
      }
    );
});

router.post('/:userName',async function(req,res){
    const newTransaction = {
        username: req.params.userName,
        stockName: req.body.stockName,
        quantity: req.body.quantity,
        price: req.body.price,
        total: req.body.total,
        date: req.body.date,
        action: req.body.action
    };
   // console.log(newTransaction);
    transactionoModel.create(newTransaction, function (err, newlyInserted) {
        if (err) {
          res.json({ success: false, msg: err });
          console.log(err);
        } else {
          console.log(newlyInserted + "inserted documebnt");
          res.json({ success: true });
        }
      });
})
module.exports = router;