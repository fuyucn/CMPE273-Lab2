
/*
 * GET home page.
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";
var fs = require("fs");
var ejs = require("ejs");
// var mysql = require('./mysql');
// get item from mysql and show
function getItemById(req,res){

	var itemID = req.param("id");
	console.log("itemID: "+itemID);
	var date = new Date();
	var log = "item page: [ uid:" + req.session.uid +" itemID: " +itemID+" ] "+date; 
	fs.appendFile('useraction.txt',log+'\r\n',function(err){
	    if(!err)
	      console.log("log succ")
	})
    if(itemID!="undefined"){
	 	mongo.connect(mongoURL, function(){
	 		console.log("Get Item: " + itemID);
	 		var coll = mongo.collection('advertisements');
	 		coll.aggregate(
	 			[
		 			{
					    $match: {
					        "adid" : Number(itemID)
					    }
					},
					{
					    $lookup: {
							from:"users",
							localField:"sellerID",
							foreignField: "userid",
							as: "seller"
					    }
					},
					{
					    $lookup: {
							from:"users",
							localField:"biderid",
							foreignField: "userid",
							as: "bider"
					    }
					}
		 		]
		 	, function(err, result) {
		 		if(result){
			 		console.log("Just read all items");
				    console.log(JSON.stringify(result));
				    console.log("uid: "+ req.session.uid);
				    res.render('item',{data:result,userid:req.session.uid});
		 		}else{
		 			console.log("Get nothing from ads");
		 		}

			});
		});
	 }else{
	 	res.redirect('/');
	 }
};
exports.index=getItemById;
