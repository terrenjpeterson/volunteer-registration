#!/user/bin/env node

// include the required node.js packages

var express = require('express')
var fs = require('fs');
var AWS = require('aws-sdk');
    AWS.config.update({region:'us-east-2'});
const https = require('https');

var app = express();

// set variables for the various html file names

var INPUT_FILE = "index.html";
var MAP_FILE = "map.html";
var RICHMOND_FILE = "richmond.html";
var THIRD_FILE = "third.html";
var ADMIN_FILE = "admin.html";
var STREETS_FILE = "streets.html";
var HENRICO_FILE = "henrico.html";
var HANOVER_FILE = "hanover.html";
var CHESTERFIELD_FILE = "chesterfield.html";
var ASSIGN_FILE = "assign.html";
var GOOGLE_FILE = "google.html";
var BLOCK_FILE = "data/blockData.geojson";

// read html files into memory so that they can be responded to when a http request is made

var upload_page = fs.readFileSync(INPUT_FILE, 'utf8');
var map_page = fs.readFileSync(MAP_FILE, 'utf8');
var richmond_page = fs.readFileSync(RICHMOND_FILE, 'utf8');
var third_page = fs.readFileSync(THIRD_FILE, 'utf8');
var admin_page = fs.readFileSync(ADMIN_FILE, 'utf8');
var google_page = fs.readFileSync(GOOGLE_FILE, 'utf8');
var streets_page = fs.readFileSync(STREETS_FILE, 'utf8');
var henrico_page = fs.readFileSync(HENRICO_FILE, 'utf8');
var hanover_page = fs.readFileSync(HANOVER_FILE, 'utf8');
var chesterfield_page = fs.readFileSync(CHESTERFIELD_FILE, 'utf8');
var assign_page = fs.readFileSync(ASSIGN_FILE, 'utf8');
var blockRawData_01 = fs.readFileSync('data/blockData-01.geojson', 'utf8');
var blockRawData_02 = fs.readFileSync('data/blockData-02.geojson', 'utf8');
var blockRawData_03 = fs.readFileSync('data/blockData-03.geojson', 'utf8');
var blockRawData_04 = fs.readFileSync('data/blockData-04.geojson', 'utf8');
var blockRawData_05 = fs.readFileSync('data/blockData-05.geojson', 'utf8');
var blockRawData_06 = fs.readFileSync('data/blockData-06.geojson', 'utf8');
var blockRawData_07 = fs.readFileSync('data/blockData-07.geojson', 'utf8');
var blockRawData_08 = fs.readFileSync('data/blockData-08.geojson', 'utf8');
var blockRawData_09 = fs.readFileSync('data/blockData-09.geojson', 'utf8');
var blockRawData_10 = fs.readFileSync('data/blockData-10.geojson', 'utf8');
var blockRawData_11 = fs.readFileSync('data/blockData-11.geojson', 'utf8');
var blockRawData_12 = fs.readFileSync('data/blockData-12.geojson', 'utf8');

// this gets static files linked so that they may be served in get requests

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

// this loads block level data
console.log("Loading Block Level Data");
var blockData = {};
    blockData.type = "FeatureCollection";
var featureArray = [];
var blockData01 = eval('(' + blockRawData_01 + ')');
var blockData02 = eval('(' + blockRawData_02 + ')');
var blockData03 = eval('(' + blockRawData_03 + ')');
var blockData04 = eval('(' + blockRawData_04 + ')');
var blockData05 = eval('(' + blockRawData_05 + ')');
var blockData06 = eval('(' + blockRawData_06 + ')');
var blockData07 = eval('(' + blockRawData_07 + ')');
var blockData08 = eval('(' + blockRawData_08 + ')');
var blockData09 = eval('(' + blockRawData_09 + ')');
var blockData10 = eval('(' + blockRawData_10 + ')');
var blockData11 = eval('(' + blockRawData_11 + ')');
var blockData12 = eval('(' + blockRawData_12 + ')');

for (var j = 0; j < blockData01.features.length; j++) {
  featureArray.push(blockData01.features[j]);
}

for (var j = 0; j < blockData02.features.length; j++) {
  featureArray.push(blockData02.features[j]);    
}

for (var j = 0; j < blockData03.features.length; j++) {
  featureArray.push(blockData03.features[j]);    
}

for (var j = 0; j < blockData04.features.length; j++) {
  featureArray.push(blockData04.features[j]);    
}

for (var j = 0; j < blockData05.features.length; j++) {
  featureArray.push(blockData05.features[j]);    
}

for (var j = 0; j < blockData06.features.length; j++) {
  featureArray.push(blockData06.features[j]);    
}

for (var j = 0; j < blockData07.features.length; j++) {
  featureArray.push(blockData07.features[j]);    
}

for (var j = 0; j < blockData08.features.length; j++) {
  featureArray.push(blockData08.features[j]);    
}

for (var j = 0; j < blockData09.features.length; j++) {
  featureArray.push(blockData09.features[j]);    
}

for (var j = 0; j < blockData10.features.length; j++) {
  featureArray.push(blockData10.features[j]);    
}

for (var j = 0; j < blockData11.features.length; j++) {
  featureArray.push(blockData11.features[j]);    
}

for (var j = 0; j < blockData12.features.length; j++) {
  featureArray.push(blockData12.features[j]);    
}

blockData.features = featureArray;

console.log("First Record");
console.log(blockData.features[0].properties);
console.log("Total Records: " + blockData.features.length);

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

app.get('/hanover.html', function (req, res) {
  res.send(hanover_page)
  console.log('hanover map page hit');
})

app.get('/chesterfield.html', function (req, res) {
  res.send(chesterfield_page)
  console.log('chesterfield map page hit');
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
  // first receive the street data provided in the request
  //
  var data = "";

  request.on("data", function(chunk) {
    data += chunk;
  });
  request.on("end", function() {
    // object has been received - now process
    console.log("Processing Request");

    var volunteerData = eval('(' + data + ')');

    console.log('data provided: ' + JSON.stringify(volunteerData));

    console.log('Looking for Street Name: ' + volunteerData.streetName);

    var matchedBlocks = 0;
    var blockOptions = [];
    var matchedId = '';
    var currBlockData = {};

    for (var i = 0; i < blockData.features.length; i++) {
      //console.log("Checking " + blockData.features[i].properties.streetName + " match " + volunteerData.streetName);
      if (blockData.features[i].properties.streetName == volunteerData.streetName) {
        //console.log("Found Match :" + JSON.stringify(blockData.features[i]));
	// check to see if a street number was provided - if so, need to match one of the attributes for the block
	if (volunteerData.streetNumber) {
	    //console.log("Match Street Number: " + volunteerData.streetNumber);
	    //console.log("Block Data: " + JSON.stringify(blockData.features[i]));
	    if (volunteerData.streetNumber == blockData.features[i].properties.leftFromAddress ||
	        volunteerData.streetNumber == blockData.features[i].properties.leftToAddress ||
		volunteerData.streetNumber == blockData.features[i].properties.rightFromAddress ||
		volunteerData.streetNumber == blockData.features[i].properties.rightToAddress) {

		  matchedBlocks += 1;
		  matchedId = blockData.features[i].id;
		  currBlockData = blockData.features[i]
	    }
        } else {
	    // no street number provided in the search to match to
	    //console.log("No block number provided");

            matchedBlocks += 1;
            matchedId = blockData.features[i].id;
	    currBlockData = blockData.features[i]

	    // this is the object returned back in the API response that simplifies the from/to on the block
            var blockMatch = {};

	    if (blockData.features[i].properties.leftFromAddress) {
		blockMatch.from = blockData.features[i].properties.leftFromAddress;
	    } else {
		blockMatch.from = blockData.features[i].properties.rightFromAddress;
	    }

            if (blockData.features[i].properties.leftToAddress) {
                blockMatch.to = blockData.features[i].properties.leftToAddress;
            } else {
                blockMatch.to = blockData.features[i].properties.rightToAddress;
            }

	    //console.log("Block Match :" + JSON.stringify(blockMatch));

            blockOptions.push(blockMatch);
	}
      }
    }

    console.log("Blocks Matched :" + matchedBlocks);
    console.log("Current Block Data :" + JSON.stringify(currBlockData));

    // format response
    var responseData = {};

    // response varies based on how many blocks were matched
    if (matchedBlocks == 0) {
      // no block was found to match - provide error message
      responseData.message = 'Block Not Found';
      response.send(responseData);

    } else if (matchedBlocks == 1) {
      // a single block was found - go ahead and call the API to update the feature
      responseData.message = 'Found Block. Feature Id:' + matchedId;

      // update the current block data with the new user provided information
      currBlockData.properties.volunteerName   = volunteerData.volunteerName;
      currBlockData.properties.volunteerStatus = true;

      // these are the parameters for the dataset containing the feature to be updated
      const token = 'sk.eyJ1IjoidGVycmVuIiwiYSI6ImNrOTl6eHF3aTAwcWkzbHF1ZWJwZTM1NjIifQ.A2ufEIax4lDJ53ZXemEXjg';
      const datasetId = 'ck9haxjo108f72ln6v3skobfn';

      // these are the parameters for the API endpoint including the feature to be updated
      const api_url = 'api.mapbox.com';
      const api_uri = '/datasets/v1/terren/' + datasetId + '/features/' + matchedId + '?access_token=' + token;
      const api_port = 443;

      var options = {
          host: api_url,
          path: api_uri,
          port: api_port,
          method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
           }
      };

      console.log("Starting API call");

      var req = https.request(options, (res) => {
          console.log('statusCode:', res.statusCode);
          console.log('headers:', res.headers);

          res.on('data', (d) => {
              console.log("data sent:" + d);
          });
          res.on('error', (e) => {
              console.log("error received");
              console.error(e);
          });
          res.on('end', function() {
              console.log("ending put request");
          });
      });

      req.on('error', error => {
          console.log("exception found");
          console.error(error);
      });

      req.write(JSON.stringify(currBlockData));
      req.end();

      console.log(JSON.stringify(responseData));

      response.send(responseData);

    } else {
      // more than one block was found - send error message back along with the array of blocks
      responseData.message = 'Multiple blocks found. Please add Street Number';
      responseData.blocks  = blockOptions;

      console.log(JSON.stringify(responseData));

      response.send(responseData);
    }
  });
})

// this is the wrapper for the publish tileset API
app.post('/updateMap', function (request, response) {
  console.log("update map API requested");
  var responseData = {};
      responseData.message = 'Update Requested';

  response.send(responseData);
})

app.listen(3000, function () {
  console.log('Registration app listening on port 3000!')
})
