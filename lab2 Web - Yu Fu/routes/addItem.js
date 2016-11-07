
var ejs = require("ejs");
//var mysql = require('./mysql');
//mongodb connect
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";
var fs = require("fs");
var mq_client = require('../rpc/client');
//post item into mysql
exports.postItem = function(req,res)
{

	console.log("start add item");

  var name = req.param("itemName");
  var detail = req.param("detail");
  var price = req.param("price");
  var quantity = req.param("quantity");
  var loc = req.param("loc");
  var userid = req.session.uid;
  var bid = req.param("bid");
  var showBid = req.param("useBid");
  var json_responses;
  var msg_payload = { "name": name, "detail":detail,"price":price,"quantity":quantity,"sellerID":userid,"location":loc,"bid":bid,"showBid":showBid};
    console.log("start");
    mq_client.make_request('post_item_queue',msg_payload, function(err,results){
      console.log(results);
      if(err){
        throw err;
      }
      else 
      {
        json_responses = {"statusCode" : results.code,"uid":results.uid};
        res.send(json_responses);
      }  
  });


/*  mongo.connect(mongoURL, function(){
    console.log('Connected to mongo at: ' + mongoURL);      
    var coll = mongo.collection('advertisements');

    var adid = mongo.getNextSequence("adid",function(req){

        
        if(showBid!=true){
          var insert = {adid:req,name:name,detail:detail,price:price,quantity:quantity,sellerID:userid,location:loc}
        }else{
          var insert = {adid:req,name:name,detail:detail,price:price,quantity:quantity,sellerID:userid,location:loc,bid:bid,bidtime:new Date()}
        }
        coll.insert(insert, function(err,insert){
        console.log("Inserted new advertisements!"); 
        if(err){
          json_responses = {"statusCode" : 401,"uid":userid};
          res.send(json_responses);
          console.log("throw");
          throw err;
        }
        else
        {
          if(insert)
          {
            console.log("valid post item");
            json_responses = {"statusCode" : 200, "uid":userid};
            res.send(json_responses);
            console.log("item:  POSTed!");  
            var log = "post new item: [ uid:" + req.session.uid +" itemID: " +req+" ]"; 
            var date = new Date();
            fs.appendFile('useraction.txt',log+" "+date+'\r\n',function(err){
                if(!err)
                  console.log("log succ")
            })
          }else{
            console.log("invalid post item");
            json_responses = {"statusCode" : 401, "uid":userid};
            res.send(json_responses);
            console.log("item:  POSTed!");  
          }
        }
      });
    });
  });*/

};

//redirect to additem page
exports.addItem = function(req,res)
{
  var date = new Date();
  fs.appendFile('useraction.txt',"additem page "+date+'\r\n',function(err){
      if(!err)
        console.log("log succ")
  })
	if(req.session.uid)
	{
		console.log("start add itempage");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('addItem', { });
	}
	else {
		res.redirect('/login');
	}
};
