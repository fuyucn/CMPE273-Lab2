//var ejs = require("ejs");
//var mysql = require('./mysql');
var mongo = require("../routes/mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";

function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	
	//mongodb connection to add new user
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		//check if user exist
		coll.findOne({email: msg.username}, function(err, user){
		  if (user) {
		    // This way subsequent requests will know the user is logged in.
		    // req.session.username = user.username;
		    //console.log(req.session.username +" is the session");
		    res.code = "400";
		    res.value = "user Existed";
		   // json_responses = {"statusCode" : 400};
		    //res.send(json_responses);
		} else {
		    mongo.connect(mongoURL, function(){
		        console.log('Connected to mongo at: ' + mongoURL);           
		        var uid = mongo.getNextSequence("userid",function(req){
		           coll.insert({userid:req,email:msg.username,password:msg.password,firstname:msg.firstname,lastname:msg.lastname,location:msg.location}, function(err,insert){
		            console.log("Inserted new user!"); 
		            if (!err){
		              if(insert){
		              	res.code = "200";
		    			res.value = "Succes Register";
		              }
		            } else {
		              	res.code = "401";
		   				res.value = "Succes Failed";
		            }

		            //
		            //res.send(json_responses);
		          });
		        });

		    });
		}
	  	callback(null, res);

		});
	});
}

exports.handle_request = handle_request;