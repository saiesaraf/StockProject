var express = require('express');
var router = express.Router();
var data= require('../public/Controller/GetData.js');

/* GET home page. */

router.get('/:stockName', async function(req, res) {
    data1 = new data();
    var currentStock = await data1.getData(req.params.stockName);
    res.send(currentStock);
});
/*sHOW Page*/
router.get('/showdetails/:stockName',async (req,res,next) => 
{
    try {
        data1 = new data();
        const stocks = await data1.getAllDataForStock(req.params.stockName);    
        res.send(stocks)
        //res.render("stocks",{stocks: stocks})
        
    } catch(error) {
        next(error)
    }
});




module.exports = router;
