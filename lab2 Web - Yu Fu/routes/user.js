
var ejs = require("ejs");
//var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";
var fs = require("fs");
/*
 * GET users listing.
 */


exports.list = function(req, res){
    var date =  new Date();
  var log = "user page: [ ] "+date; 
  fs.appendFile('useraction.txt',log+'\r\n',function(err){
      if(!err)
        console.log("log succ")
  })
  var myID;
  var userInfo;
  var sellItems;
  var buyItems;
  if(req.session.uid){

    if (!req.param("id"))
    {
      myID =req.session.uid;
    }
    else {
      myID = req.param("id");
    }

    if(req.session.uid==myID){
      mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var usersColl = mongo.collection('users');
        console.log("uid: "+req.session.uid);
        usersColl.findOne({userid: req.session.uid}, function(err, user){
          console.log();
          if (user) {
            userInfo = user;
            console.log("get user info: "+ userInfo.firstname + " "+userInfo.lastname);
            console.log("+++++++Get uinfo success!" + JSON.stringify(userInfo));
          } else {
            console.log("ERROR: No users found in database");

          }
        });

        //get sell list of user
        var adColl = mongo.collection('advertisements');
        adColl.find({sellerID:req.session.uid}).toArray(function(err, sells){
          if(err)
          {
            console.log("ERROR: get sells Item from db");
          }
          else{
            if (sells != null) {
              sellItems = sells;
              console.log("+++++++Get sellItems success! " + JSON.stringify(sells[0]));

            } else {
              console.log("ERROR: No sells found in database");
            }
          }
        });

        //get buy list of user
        var trColl = mongo.collection('transaction');
        trColl.aggregate(
          [
            {
              $match: {
                  "buyerID" : Number(req.session.uid)
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
                from:"advertisements",
                localField:"itemID",
                foreignField: "adid",
                as: "advertisement"
              }
            }
          ]
        , function(err, buys){
          if(err)
          {
            console.log("ERROR: get buys Item from db");
          }
          else{
            if (buys) {
              buyItems = buys;
              console.log("+++++++Get buyItems success! " +JSON.stringify(buys));
            } else {
               console.log("ERROR: No buys found in database");
            }
            
          }
          console.log(buyItems[0]);
           res.render('user',{'buys':buyItems,'sells':sellItems,'uinfo':userInfo,'userid':myID});
        });
        console.log("END OF USER PAGE! ");
       
      });

    } else {
        res.redirect("/profile/"+myID);
    }
  }else{
     res.redirect("/login");
  }
   

};


exports.profile = function(req,res)
{
  var profileID;
  console.log("get profile id:" + req.param("id"));

  if (!req.param("id") || req.param("id")==undefined)
  {
    profileID = req.session.uid;
  }
  else {
    profileID = Number(req.param("id"));
  }
  var date =  new Date();
  var log = "profile page: [ "+profileID+"] "+date; 
  fs.appendFile('useraction.txt',log+'\r\n',function(err){
      if(!err)
        console.log("log succ")
  })
  var userInfo='';
	console.log("start profile");
  if(profileID){
    console.log("profile id:" + profileID);
    mongo.connect(mongoURL, function(){
      //console.log('Connected to mongo at: ' + mongoURL);
      var coll = mongo.collection('users');
      console.log("profile: " + profileID);
      coll.findOne({userid: profileID}, function(err, user){
        if(!err)
        {
          if (user) {
            console.log(JSON.stringify(user));
            userInfo=user;
            res.render('profile', {'userid':req.session.uid, 'profileID':profileID,'uinfo':userInfo});
          } else {
            console.log("no profile find");
            //console.log(JSON.stringify(user));
            res.redirect('/profile');
          }
        }else{
          console.log(err);
        }

      });
    });
  }else{
    console.log("get profileID error");
    res.redirect('/user');
  }
};

//Logout the user - invalidate the session
exports.logout = function(req,res)
{
  var date =  new Date();
  var log = "logout page: [ "+req.session.uid+"] "+date; 
  fs.appendFile('useraction.txt',log+'\r\n',function(err){
      if(!err)
        console.log("log succ")
  })
	console.log("start logout");
	req.session.destroy();
	res.redirect('/');
};
