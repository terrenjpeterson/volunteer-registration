#!/user/bin/env node

// include the required node.js packages

var express = require('express')
var fs = require('fs');
var AWS = require('aws-sdk');
    AWS.config.update({region:'us-east-2'});

var app = express();

// set variables for the various html file names

var INPUT_FILE = "index.html";
var MAP_FILE = "map.html";
var RICHMOND_FILE = "richmond.html";
var THIRD_FILE = "third.html";
var ADMIN_FILE = "admin.html";
var STREETS_FILE = "streets.html";
var HENRICO_FILE = "henrico.html";
var ASSIGN_FILE = "assign.html";
var GOOGLE_FILE = "google.html";

// read html files into memory so that they can be responded to when a http request is made

var upload_page = fs.readFileSync(INPUT_FILE, 'utf8');
var map_page = fs.readFileSync(MAP_FILE, 'utf8');
var richmond_page = fs.readFileSync(RICHMOND_FILE, 'utf8');
var third_page = fs.readFileSync(THIRD_FILE, 'utf8');
var admin_page = fs.readFileSync(ADMIN_FILE, 'utf8');
var google_page = fs.readFileSync(GOOGLE_FILE, 'utf8');
var streets_page = fs.readFileSync(STREETS_FILE, 'utf8');
var henrico_page = fs.readFileSync(HENRICO_FILE, 'utf8');
var assign_page = fs.readFileSync(ASSIGN_FILE, 'utf8');

// this gets static files linked so that they may be served in get requests

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

// this processes the main request to the home page

app.get('/', function (req, res) {
  res.send(richmond_page)
  console.log('basic website hit');
})

app.get('/ping.html', function (req, res) {
  res.send(upload_page)
  console.log('successful ping made');
})

app.get('/index.html', function (req, res) {
  res.send(upload_page)
  console.log('basic index page hit');
})

app.get('/richmond.html', function (req, res) {
  res.send(richmond_page)
  console.log('richmond map page hit');
})

app.get('/assign.html', function (req, res) {
  res.send(assign_page)
  console.log('volunteer assignment page hit');
})

app.get('/streets.html', function (req, res) {
  res.send(streets_page)
  console.log('streets map page hit');
})

app.get('/henrico.html', function (req, res) {
  res.send(henrico_page)
  console.log('henrico map page hit');
})

app.get('/google.html', function (req, res) {
  res.send(google_page)
  console.log('google page hit');
})

app.get('/third.html', function (req, res) {
  res.send(third_page)
  console.log('third map page hit');
})

app.get('/admin.html', function (req, res) {
  res.send(admin_page)
  console.log('admin map page hit');
})

app.get('/.html', function (req, res) {
  res.send(admin_page)
  console.log('admin map page hit');
})

app.get('/map.html', function (req, res) {
  res.send(map_page)
  console.log('map page hit');
})

app.get('/terms.html', function (req, res) {
  res.send(terms_page)
  console.log('terms page hit');
})

app.get('/useragreement-template.html', function (req, res) {
  res.send(user_agreement_page)
  console.log('user agreement page hit');
})

app.get('/ping.html', function (req, res) {
  res.send('successful ping');
  console.log('someone pinged me');
})

app.post('/updateBlock', function (request, response) {
  var reqInfo = request.headers['user-agent'];
  var reqDevice = reqInfo.slice(13, reqInfo.search(";"))
  console.log('attempted to update a block using device ' + reqDevice);

  //
  // first receive the game id object coming in from the request
  //
  var data = "";

  request.on("data", function(chunk) {
    data += chunk;
  });
  request.on("end", function() {
    // object has been received - now process
    console.log("Processing Request");

    var volunteerData = eval('(' + data + ')');
    //var gameId = gameData.gameId;

    console.log('data provided: ' + JSON.stringify(volunteerData));

    // send response back
    response.send('complete');

  });
})

app.listen(3000, function () {
  console.log('Registration app listening on port 3000!')
})
