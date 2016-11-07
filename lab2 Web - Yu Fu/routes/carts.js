
var ejs = require("ejs");
//var mysql = require('./mysql');
//var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";
// file system
var fs = require("fs");
var mq_client = require('../rpc/client');
//add item into carts
exports.addToCarts = function(req,res)
{
    if(!req.session.uid)
    {
      var json_responses = {"statusCode" : 400};
      res.send(json_responses);
    }
    else {
      var carts = req.session.carts || [];
      var cartsize =carts.length;
      var adid = req.param("adid");
      var name = req.param("name");
      var price = req.param("price");
      var sellerid = req.param("sellerid");
      var bid = req.param("bid");
      var bidtime = req.param("bidTime");
      console.log(cartsize);
      var log = "Add to Cart: " + " [ " + "uid: " +req.session.uid +", "+name+", " +price+ " ] ";
      var result;
      if (carts.push({"cartid":cartsize,"adid": adid, "name":name, "price":price, "sellerid":sellerid})){
          result = "add success";
          log+= result;
      }
      else {
        result = "add fail";
        log+= result  ;
      }
      console.log(result);
      var date = new Date();
      fs.appendFile('useraction.txt',log+" "+date+'\r\n',function(err){
        if(!err)
          console.log("log succ")
      })
   
      
      req.session.carts=carts;

      var json_responses = {"statusCode" : 200, "carts":req.session.carts};
      res.send(json_responses);
    }
}

//new bid
exports.bid = function(req,res)
{
    if(!req.session.uid)
    {
      var json_responses = {"statusCode" : 400};
      res.send(json_responses);
    }
    else {
      var msg_payload = { "bid": Number(req.param("newbid")), "biderid": req.session.uid,"adid":Number(req.param("adid")) };
      console.log(msg_payload);
      mq_client.make_request('bid_queue',msg_payload, function(err,results){
        console.log(results);
        if(err){
          throw err;
        }
        else 
        {
          if(results.code == 200){
            var log = "New bid: " + new Date()+ " [ " + "uid: " +req.session.uid +", newBid: "+req.param("newbid")+ ", itemID: "+req.param("adid") +" ] ";
            fs.appendFile('userbid.txt',log+'\r\n',function(err){
              if(!err)
                console.log("log succ")
            })
          }
          else {    
            console.log("Invalid bid");
          }
          json_responses = {"statusCode" : results.code};
          res.send(json_responses);
        }  
      });
  }
}

// redirect to cart page
exports.cartspage = function(req,res)
{
  var empty;
  if (req.session.uid){
    if (req.session.carts){
        for(var i in req.session.carts){
            console.log(req.session.carts[i]);
        }
        empty = false;
        var nullCount = 0;
        for( var i in req.session.carts)
        {
          if (req.session.carts[i]==null)
            nullCount++;
        }
        if (nullCount == req.session.carts.length)
        {
          empty=true;
        }
        res.render('carts', { 'data':req.session.carts, 'userid':req.session.uid,'empty':empty });
    }
    else{
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.render('carts', { 'data':req.session.carts, 'userid':req.session.uid,'empty':empty });
    }
  }else{
      res.redirect('/');
  }
}

//delitem from carts
exports.delFromCarts = function(req,res)
{

  var itemID = req.param("id");
  var log = "Del From Cart: " + " [ " + "uid: " +req.session.uid +", itemID: "+itemID+"]"; 
  fs.appendFile('useraction.txt',log+'\r\n',function(err){
      if(!err)
        console.log("log succ")
  })
  if (req.session.uid)
  {
    if (req.session.carts){
      //req.session.carts.splice(itemID,1);
      delete req.session.carts[itemID];
    }
    res.redirect('/carts');
  }else{
    res.redirect("/");
  }

}

//redirect to pay
exports.payPage = function(req,res)
{
  var log = "Redirect to pay page"; 
  fs.appendFile('useraction.txt',log+'\r\n',function(err){
      if(!err)
        console.log("log succ")
  })
  res.render('payPage', { });
}


//delitem from carts
exports.submitCarts = function(req,res)
{
  var log = "Submit carts: uid: " +req.session.uid; 
  fs.appendFile('useraction.txt',log+'\r\n',function(err){
      if(!err)
        console.log("log succ")
  })
  var json_responses;
  if(req.session.uid && req.session.carts){
    console.log("carts:" + req.session.carts);
    for(var i in req.session.carts)
    {
      if (req.session.carts[i]!='null'){
      // var updateItem = "UPDATE advertisements SET quantity=(quantity-1) WHERE adid ="+req.session.carts[i].adid+";"
      // var payCarts = "INSERT INTO transactions (sellerID, buyerID,itemID) VALUES ("+req.session.carts[i].sellerid+","+req.session.uid+","+req.session.carts[i].adid+");";
        var tranColl = mongo.collection('transaction');
        var adUpdate = mongo.collection('advertisements');
        mongo.connect(mongoURL, function(){
          console.log('Connected to mongo at: ' + mongoURL);           
          var id = mongo.getNextSequence("transaction",function(id){
            console.log("id:"+id);
            tranColl.insert({id:id, sellerID:req.session.carts[i].sellerid, buyerID:req.session.uid, itemID:req.session.carts[i].adid}, function(err,insert){
              console.log("Inserted new user!"); 
              if (!err){
                if(insert){
                  console.log('Connected to mongo at: ' + mongoURL);           
                     adUpdate.update({adid:Number(req.session.carts[i].adid)},{$inc:{quantity:-1}}, function(err,update){
                      if (!err){
                        if(update){
                          console.log("update:" + update);
                          console.log("transaction successful, [ id: " + id + ", name: " );
                          delete req.session.carts;
                          json_responses = {"statusCode" : 200,"uid":req.session.uid};
                          res.send(json_responses);
                        }
                      } else {
                        console.log("transaction fail");
                      }
                    });
                }
              } else {
                  //res.code = "401";
                  //res.value = "Succes Failed";
                  console.log("adv fail");
              }
            });
          });
        });
      }
    }
  }
  else {
    json_responses = {"statusCode" : 401};
    res.send(json_responses);
  }

}
