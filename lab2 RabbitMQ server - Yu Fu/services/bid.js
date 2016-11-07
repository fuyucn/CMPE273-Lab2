//var ejs = require("ejs");
//var mysql = require('./mysql');
var mongo = require("../routes/mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";

function handle_request(msg, callback){
  
  var res = {};
  console.log("In handle request:"+ msg.biderid);
  
  //mongodb connection to add new user
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var adColl = mongo.collection('advertisements');
      
        adColl.findOneAndUpdate(
          {"adid":Number(msg.adid)},
          {$set : {"bid":Number(msg.bid),"biderid":msg.biderid}}, function(err, user){
          if(!err){
              res.code = 200;
            }else{
              console.log("returned false");
              res.code = 401;
            }
            callback(null, res);
        });
    });
}

exports.handle_request = handle_request;