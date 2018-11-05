var express    = require('express');
var vhost      = require('vhost');
var app        = express();
var path       = require('path');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

// Database
console.log(process.env.MONGO_JONGBUJIP);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_JONGBUJIP, { useCreateIndex: true, useNewUrlParser: true });
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
app.use('/api/menus', require('./api/menus'));
app.use('/api/auth', require('./api/auth'));   //2

app.get("/", function(req, res) {
  res.send("SiJiOrder - 새로운 시작.");
});

var hostname = 'jongbujip-api.orderfood.co.kr'; // 서버 컴퓨터의 ip
var port = 3400; //

var server = express();
server.use(vhost(hostname, app));

server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});