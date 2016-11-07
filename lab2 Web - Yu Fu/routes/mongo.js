var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
  
};


exports.getNextSequence = function(name,callback) {
  db.collection('counters').findOneAndUpdate({ _id: name }, { $inc: { 'seq': 1 }}, {new:true, upsert:true},function(err,ret){
    if(err){
        console.log("err after findOneAndUpdate"+err);
        throw err;
    }else{
      if (!ret['value']){
        console.log("Return null: " + ret["seq"]);
        console.log("Try to insert a new userid into couters, and set seq = 1 as default!");
        seq=1;
      }else{
        console.log(JSON.stringify(ret));
        console.log("Return get: "+ret['value']['seq']);
        seq=ret['value']['seq']+1;
      }
      console.log("req in mongo query: "+seq);
      callback(seq);
    }
  });
};