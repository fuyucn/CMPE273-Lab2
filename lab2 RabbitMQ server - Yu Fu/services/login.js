//var ejs = require("ejs");
//var mysql = require('./mysql');
var mongo = require("../routes/mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";

function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	
	mongo.connect(mongoURL, function(){
      console.log('Connected to mongo at: ' + mongoURL);
      var coll = mongo.collection('users');

      coll.findOne({email: msg.username, password:msg.password}, function(err, user){
        if (user) {
			console.log("valid Login");
			//res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.code = "200";
			res.value = "Succes Login";
			res.uid = user.userid;
			//res.send(json_responses);
			console.log("userid: "+user.userid+" Logged!");
         } else {
         	console.log("returned false");
		 	res.code = "401";
			res.value = "Failed Login";
		}
		callback(null, res);
      });
    });
}

exports.handle_request = handle_request;