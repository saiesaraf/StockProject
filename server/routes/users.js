var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../public/models/User");

/* Register */
router.post("/register", async function(req, res, next) { 
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.json({success: false, msg: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json({success:true}))
            .catch(err => res.json({success:false,msg:err}));
        });
      });
    }
  }).catch(err=> res.json({success:false,msg:err}))
  ;
});
/*Login*/
router.post("/login", async function(req, res, next) {
  console.log('I am in login');
  var requested_email= req.body.email;
  var password = req.body.password;
  await User.findOne({email: requested_email}).then(founduser =>
    {
      //if user exists
      if(!founduser){
        res.json({success:false, msg:"User does not exist"})
      }
      //check password:
      bcrypt.compare(password, founduser.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: founduser.id,
            name: founduser.name
          };
  
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                user:founduser
              });
            }
          );
        } else {
             res
            .json({ success:false, msg: "Password incorrect" });
        }
      });
    })
});

module.exports = router;
