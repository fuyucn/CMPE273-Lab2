
/*
 * GET home page.
 */
var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebaydb";
var fs = require("fs");
function setup (req, res){
	var allADs='';
	//var getAllADs = ""
    //mongodb connection to add new user
    console.log("uid:"+req.session.uid)
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('advertisements');
		var currentUser=0;
		if (req.session.uid){
			currentUser = req.session.uid;
	
		}
		coll.find({}).toArray(function(err, ads){
			if (ads) {
				allADs=ads;
				// This way subsequent requests will know the user is logged in.
				console.log(JSON.stringify(allADs));
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				ejs.renderFile('./views/index.ejs',{data:ads,userid:req.session.uid},function(err, result) {
					// render on success
					if (!err) {
							res.end(result);
					}
					// render or error
					else {
						//res.end('An error occurred');
						console.log(err);
					}
				});
			} else {
				console.log("returned false");

				res.render('index', { data: '',userid: currentUser});
			}

		});
	});
}



exports.index=setup;
