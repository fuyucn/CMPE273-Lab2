var ejs = require("ejs");
//var mysql = require('./mysql');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";
var mq_client = require('../rpc/client');
var fs = require("fs");
/*
 * GET register page.
 */
function index(req,res)
{
    var date =  new Date();
  var log = "register page: [ ] " +date; 
  fs.appendFile('useraction.txt',log+'\r\n',function(err){
      if(!err)
        console.log("log succ")
  })
  if (req.session.uid){
    res.redirect('/');
  }
  else {
    res.render('register', { title: 'Ebay - Login' });
  }

}


 function register(req,res)
 {
   var username= req.param("username");
   var password= req.param("password");
   var firstname= req.param("firstname");
   var lastname= req.param("lastname");
   var location= req.param("location");
 

   if (username == undefined || password == undefined || firstname == undefined || lastname ==undefined)
   {
     json_responses = {"statusCode" :401, "userid" : req.session.uid};
     res.send(json_responses);
   }else{
     // check user already exists
     var crypto = require('crypto');
     password=crypto.createHash('md5').update(password).digest("hex");

      var msg_payload = { "username": username, "password": password,"firstname":firstname,"lastname":lastname,"location":location };
      mq_client.make_request('register_queue',msg_payload, function(err,results){
        console.log(results);
        if(err){
          throw err;
        }
        else 
        {
          json_responses = {"statusCode" : results.code};
          res.send(json_responses);
        }  
    });


   }
}

exports.register=register;
exports.index=index;
