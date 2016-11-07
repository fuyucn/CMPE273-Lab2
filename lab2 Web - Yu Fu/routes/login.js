
var ejs = require("ejs");
//var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";
var crypto = require('crypto');
var mq_client = require('../rpc/client');
var fs = require("fs");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

function setup (req, res){

  res.render('login', { title: 'Ebay - Login' });
  var date = new Date();
  var log = "login page: [ ] " +date; 
  fs.appendFile('useraction.txt',log+'\r\n',function(err){
          if(!err)
            console.log("log succ")
   })
};

exports.signin = function(req,res) {
  // check user already exists
  var user = req.param("username");
  var pw = crypto.createHash('md5').update(req.param("password")).digest("hex");
  
    console.log("user:"+user+", pw:" +pw+" .try to login!");
    var json_responses;
    if (user == undefined || pw == undefined)
    {
      console.log("login info error");
      var json_responses = {"statusCode" : 401};
      res.send(json_responses);
    }else {
        console.log("Start send login to queue");
        var msg_payload = { "username": user, "password": pw };
        var date = new Date();
        var log = "login: [ user:" + user +" ] " +date; 
        fs.appendFile('useraction.txt',log+'\r\n',function(err){
            if(!err)
              console.log("log succ")
        })
       mq_client.make_request('login_queue',msg_payload, function(err,results){
        console.log(results);
        if(err){
          throw err;
        }
        else 
        {
          if(results.code == 200){
            console.log("valid Login");
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            req.session.uid=results.uid;

          }
          else {    
            console.log("Invalid Login");
          }
          json_responses = {"statusCode" : results.code};
          res.send(json_responses);
        }  
      });
    }

};


exports.index = setup;
