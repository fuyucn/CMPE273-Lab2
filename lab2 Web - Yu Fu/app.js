
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , login = require('./routes/login')
  , index = require('./routes/index')
  , register = require('./routes/register')
  , item = require('./routes/item')
  , addItem = require('./routes/addItem')
  , carts = require('./routes/carts')
  , path = require('path')
  //Importing the 'client-sessions' module
  , session = require('client-sessions');
  
var passport = require('passport');

var app = express();
var mongoSessionConnectURL = "mongodb://localhost:27017/ebaydb";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

// all environments
//configure the sessions with our application
app.use(session({
	cookieName: 'session',
	secret: 'cmpe273_ebayApp',
	duration: 60 * 60 * 1000,    //setting the time for active session
	activeDuration: 30 * 60 * 1000,  
    store: new mongoStore({
    url: mongoSessionConnectURL
  })
})); // setting time for the session to be active when the window is open // 5 minutes set currently

app.use(passport.initialize());
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//GET
app.get('/', routes.index);
app.get('/login', login.index);
app.get('/register',register.index);
app.get('/item/:id',item.index);
app.get('/user/:id',user.list);
app.get('/user',user.list);
app.get('/profile/:id',user.profile);
app.get('/profile',user.profile);
app.get('/logout', user.logout);
app.get('/addItem',addItem.addItem);
app.get('/carts',carts.cartspage);
app.get('/delFromCarts/:id',carts.delFromCarts);
app.get('/payPage',carts.payPage);
//POST
app.post('/regUser',register.register);
app.post('/signin', login.signin);
app.post('/postItem',addItem.postItem);
app.post('/addToCarts',carts.addToCarts);
app.post('/submitCarts',carts.submitCarts);
app.post('/newbid',carts.bid);

mongo.connect(mongoSessionConnectURL, function(){
  console.log('Connected to mongo at: ' + mongoSessionConnectURL);
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});