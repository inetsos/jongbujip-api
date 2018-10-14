var express    = require('express');
var app        = express();
var path       = require('path');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

// Database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB, { useCreateIndex: true, useNewUrlParser: true });
var db = mongoose.connection;
db.once('open', function () {
   console.log('DB connected!');
});
db.on('error', function (err) {
  console.log('DB ERROR:', err);
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //1
  next();
});

// API
app.use('/api/users', require('./api/users')); //2
app.use('/api/auth', require('./api/auth'));   //2

var hostname = 'jongbujip-api.orderfood.co.kr'; // 서버 컴퓨터의 ip
var port = 3400; //

var server = express();
server.use(vhost(hostname, app));

// Server
//var port = 3300;
server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});