var express = require("express");
var router = express.Router();
var companyModel = require("../public/models/companies");

router.get("/", async function(req, res, next) {
    const companies = await companyModel.find({});
    res.send(companies);
  });


module.exports = router;