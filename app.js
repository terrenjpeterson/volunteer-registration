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
var GOOGLE_FILE = "google.html";

// read html files into memory so that they can be responded to when a http request is made

var upload_page = fs.readFileSync(INPUT_FILE, 'utf8');
var map_page = fs.readFileSync(MAP_FILE, 'utf8');
var richmond_page = fs.readFileSync(RICHMOND_FILE, 'utf8');
var third_page = fs.readFileSync(THIRD_FILE, 'utf8');
var admin_page = fs.readFileSync(ADMIN_FILE, 'utf8');
var google_page = fs.readFileSync(GOOGLE_FILE, 'utf8');
var streets_page = fs.readFileSync(STREETS_FILE, 'utf8');

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

app.get('/streets.html', function (req, res) {
  res.send(streets_page)
  console.log('streets map page hit');
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

app.post('/validateGame', function (request, response) {
  var reqInfo = request.headers['user-agent'];
  var reqDevice = reqInfo.slice(13, reqInfo.search(";"))
  console.log('attempted to validate a game id using device ' + reqDevice);

  //
  // first receive the game id object coming in from the request
  //
  var data = "";

  request.on("data", function(chunk) {
    data += chunk;
  });
  request.on("end", function() {
    // object has been received - now validate if its in the DDB table

    var gameData = eval('(' + data + ')');
    var gameId = gameData.gameId;
    var gameDt = gameData.gameDt;

    console.log('game id validation provided: ' + gameId);

    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: "scavangeGameTbl",
        KeyConditionExpression: "#gameDt = :gameDt and #gameId = :gameId",
        ExpressionAttributeNames:{ "#gameDt": "gameDt", "#gameId": "gameId" },
        ExpressionAttributeValues: { ":gameDt":gameDt, ":gameId":gameId }
    };

    docClient.query(params, function(err,result) {
        if(err) {
            console.log('error' + err);
            response.send('error occurred' + err);
        } else {
            // if the dynamoDB query comes back empty, send not found message - else return game information
            var responseData = {};
                responseData.gameId = gameId;
            if (result.Items.length === 0) {
                responseData.gameIdValid = false;
                responseData.message = 'could not find game ' + gameData.gameId;
            } else {
                responseData.gameIdValid = true;
                responseData.items = result.Items[0].objects.values;
            }
            response.send(responseData);
        }
    });
  });
})

app.post('/upload', function(request, response) {
  console.log('upload attempted');

  var form = new formidable.IncomingForm();
  var uploadStatus = 'normal';

  // this sets the directory for the file to be uploaded in
  // as well as keeping the file extension

  form.uploadDir = 'upld';
  form.keepExtensions = true;

  form.on('aborted', function() {
    console.log('receipt upload process aborted');
    uploadStatus = 'aborted';
  });

  form.on('fileBegin', function() {
    console.log('begin receiving file');
  });

  form.on('field', function() {
    console.log('field received');
  });

  form.on('file', function() {
    console.log('file detected');
  });

  form.parse(request, function(err, fields, files) {
    console.log('upload status : ' + uploadStatus);

    // this gets passed once the file transmission is complete
    if (uploadStatus == 'normal') {
      console.log('file successfully uploaded now writing to s3');

      console.log('fields: ' + JSON.stringify(fields));
      console.log('game id: ' + fields.gameId);
      console.log('file data: ' + JSON.stringify(files.fileToUpload));

      var newImage = files.fileToUpload.path;
      console.log('attempting to read: ' + newImage);

      var tempFile = fs.readFileSync(newImage, 'binary');

      var uploadFile = new Buffer(tempFile, 'binary');

      //var saveObj = fields.gameId + '/' + files.fileToUpload.name;
      var saveObj = fields.gameId + '/' + files.fileToUpload.path.slice(5,99);

      var s3 = new AWS.S3();

      var params = {Bucket: 'scavengerhuntskill',
                    Key: saveObj,
                    Body: uploadFile,
                    ContentType: 'image/jpeg'};

      s3.putObject(params, function(err, data) {
        if (err)
          console.log('Error uploading receipt to AWS-S3: ' + err)
        else
          console.log('Successfully uploaded new image to AWS-S3' );
        response.send();
      });
    }

  });

  form.on('error', function(err) {
    console.log('Error in receipt upload with message ' + err);
    uploadStatus = 'error';
  });

});

app.listen(3000, function () {
  console.log('Registration app listening on port 3000!')
})
