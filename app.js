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
var COLORS_FILE = "colors.html";
var HENRICO_FILE = "henrico.html";
var HANOVER_FILE = "hanover.html";
var CHESTERFIELD_FILE = "chesterfield.html";
var ASSIGN_FILE = "assign.html";
var GOOGLE_FILE = "google.html";

// this is the location in the file system for the geojson files

var RICHMOND_BLOCK_FILE = "data/Richmond-blockData.geojson";
var HENRICO_BLOCK_FILE = "data/Henrico-blockData.geojson";
var HANOVER_BLOCK_FILE = "data/Hanover-blockData.geojson";

// read html files into memory so that they can be responded to when a http request is made

var upload_page = fs.readFileSync(INPUT_FILE, 'utf8');
var map_page = fs.readFileSync(MAP_FILE, 'utf8');
var richmond_page = fs.readFileSync(RICHMOND_FILE, 'utf8');
var third_page = fs.readFileSync(THIRD_FILE, 'utf8');
var admin_page = fs.readFileSync(ADMIN_FILE, 'utf8');
var google_page = fs.readFileSync(GOOGLE_FILE, 'utf8');
var streets_page = fs.readFileSync(STREETS_FILE, 'utf8');
var colors_page = fs.readFileSync(COLORS_FILE, 'utf8');
var henrico_page = fs.readFileSync(HENRICO_FILE, 'utf8');
var hanover_page = fs.readFileSync(HANOVER_FILE, 'utf8');
var chesterfield_page = fs.readFileSync(CHESTERFIELD_FILE, 'utf8');
var assign_page = fs.readFileSync(ASSIGN_FILE, 'utf8');

// read geojson data files for each municipality

var richmondBlockData = fs.readFileSync(RICHMOND_BLOCK_FILE, 'utf8');
var henricoBlockData  = fs.readFileSync(HENRICO_BLOCK_FILE, 'utf8');
var hanoverBlockData  = fs.readFileSync(HANOVER_BLOCK_FILE, 'utf8');

// this gets static files linked so that they may be served in get requests

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

// this loads block level data - will be used in the API
console.log("Loading Block Level Data");
var blockData = {};
    blockData.type = "FeatureCollection";
var featureArray = [];

// load Richmond City data
var blockData01 = eval('(' + richmondBlockData + ')');

console.log("Loading Richmond Block Level Data");

for (var j = 0; j < blockData01.features.length; j++) {
  if (j < 5) {
    console.log(JSON.stringify(blockData01.features[j]));
  //  console.log(JSON.stringify(featureArray));
  }  
  var currentBlock = {};
      currentBlock.type        = blockData01.features[j].type;
      currentBlock.geometry    = blockData01.features[j].geometry;
      currentBlock.properties  = blockData01.features[j].properties
      currentBlock.id          = blockData01.features[j].id;
      currentBlock.properties.region = "Richmond";
  featureArray.push(currentBlock);
}

// load Henrico County data
var blockData02 = eval('(' + henricoBlockData + ')');

console.log("Loading Henrico Block Level Data");

for (var j = 0; j < blockData02.features.length; j++) {
  var currentBlock = {};
      currentBlock.type       = blockData02.features[j].type;
      currentBlock.geometry   = blockData02.features[j].geometry;
      currentBlock.properties = blockData02.features[j].properties;
      currentBlock.id         = blockData02.features[j].id;
      currentBlock.properties.region = "Henrico";
  featureArray.push(currentBlock);
}

// load Hanover County data
var blockData03 = eval('(' + hanoverBlockData + ')');

console.log("Loading Hanover Block Level Data");

for (var j = 0; j < blockData03.features.length; j++) {
  var currentBlock = {};
      currentBlock.type       = blockData03.features[j].type;
      currentBlock.geometry   = blockData03.features[j].geometry;
      currentBlock.properties = blockData03.features[j].properties;
      currentBlock.id         = blockData03.features[j].id;
      currentBlock.properties.region = "Hanover";
  featureArray.push(currentBlock);
}

// done loading individual files 
blockData.features = featureArray;

// print out info to console verifying what data was loaded
console.log("First Record " + JSON.stringify(blockData.features[0]));
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

app.get('/colors.html', function (req, res) {
  res.send(colors_page)
  console.log('colors map page hit');
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
    var matchedRegion = '';
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
		  matchedId     = blockData.features[i].id;
		  matchedRegion = blockData.features[i].properties.region;

		  currBlockData = blockData.features[i]
	    }
        } else {
	    // no street number provided in the search to match to
	    //console.log("No block number provided");

            matchedBlocks += 1;
            matchedId     = blockData.features[i].id;
	    matchedRegion = blockData.features[i].properties.region;

	    currBlockData = blockData.features[i]

	    // this is the object returned back in the API response that simplifies the from/to on the block
            var blockMatch = {};

	    if (blockData.features[i].leftFromAddress) {
		blockMatch.from = blockData.features[i].properties.leftFromAddress;
	    } else {
		blockMatch.from = blockData.features[i].properties.rightFromAddress;
	    }

            if (blockData.features[i].leftToAddress) {
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
      responseData.message = 'Found Block. Feature Id:' + matchedId + ' Region:' + matchedRegion;

      // update the current block data with the new user provided information
      currBlockData.properties.volunteerName   = volunteerData.volunteerName;
      currBlockData.properties.volunteerStatus = true;

      // these are the parameters for the dataset containing the feature to be updated
      const token = 'sk.eyJ1IjoidGVycmVuIiwiYSI6ImNrOTl6eHF3aTAwcWkzbHF1ZWJwZTM1NjIifQ.A2ufEIax4lDJ53ZXemEXjg';

      var datasetId = '';

      // note: there are multiple datasets - find the match based on the region loaded in the array
      if (matchedRegion == "Richmond") {
        datasetId = 'ck9haxjo108f72ln6v3skobfn';
      } else if (matchedRegion == "Henrico") {
    	datasetId = 'ck9j048g000u72sn2avymh1v2';
      } else if (matchedRegion == "Hanover") {
	datasetId = 'ck9zugz390eve2st7zggkymwl';
      }

      // these are the parameters for the API endpoint including the feature to be updated
      const api_url = 'api.mapbox.com';
      var   api_uri = '/datasets/v1/terren/' + datasetId + '/features/' + matchedId + '?access_token=' + token;
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

      console.log("Starting API call. " + api_uri);
      console.log(JSON.stringify(currBlockData));

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
