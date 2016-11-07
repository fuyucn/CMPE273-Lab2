//var ejs = require("ejs");
//var mysql = require('./mysql');
var mongo = require("../routes/mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";

function handle_request(msg, callback){
	
	var res = {};
	//console.log("In handle request:"+ msg.username);
	
	//mongodb connection to add new user

	  mongo.connect(mongoURL, function(){
	    console.log('Connected to mongo at: ' + mongoURL);      
	    var coll = mongo.collection('advertisements');

	    var adid = mongo.getNextSequence("adid",function(req){
 
	        if(msg.showBid!=true){
	          var insert = {adid:req,name:msg.name,detail:msg.detail,price:msg.price,quantity:msg.quantity,sellerID:msg.sellerID,location:msg.loc};
	        }else{
	          var insert = {adid:req,name:msg.name,detail:msg.detail,price:msg.price,quantity:msg.quantity,sellerID:msg.sellerID,location:msg.loc,bid:msg.bid,bidtime:new Date()};
	        }
	        coll.insert(insert, function(err,insert){
		        console.log("Inserted new advertisements!"); 
		        if(err){
		          //json_responses = {"statusCode" : 401,"uid":userid};
		          res.code = "401";
	    			res.uid = msg.sellerID;
	    			res.value = "fail";
		          //res.send(json_responses);
		          console.log("throw");
		          throw err;
		        }
		        else
		        {
		          if(insert)
		          {
		            console.log("valid post item");
		            //json_responses = {"statusCode" : 200, "uid":userid};
		            res.code = "200";
	    			res.uid = msg.sellerID;
	    			res.value = "Succes insert";
		            //res.send(json_responses);
		            console.log("item:  POSTed!"); 
		          }else{
		            console.log("invalid post item");
		            //json_responses = {"statusCode" : 401, "uid":userid};
	        		res.code = "401";
	    			res.uid = msg.sellerID;
	    			res.value = "fail insert";
		            //res.send(json_responses);
		            console.log("item:  POSTed!");  
		          }
		        }
		        callback(null, res);
	       });
	    });
	  });
	}

exports.handle_request = handle_request;