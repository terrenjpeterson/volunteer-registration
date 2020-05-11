'use strict';

const https = require('https');

exports.handler = (event, context, callback) => {
    
    // this is the secure token - need to get this into a secrets manager
    const token = 'xxx';
    // this is the API endpoint for pulling a dataset from mapbox
    const sourcePath = "mapbox://tileset-source/terren/ck9zugz390eve2st7zggkymwl";
    // this is the name of the new tileset that will be created
    const tilesetId = 'terren.abc123';

    const api_url = 'api.mapbox.com';
    const api_uri = '/tilesets/v1/' + tilesetId + '?access_token=' + token;
    const api_port = 443;

    console.log("prepare update feature property API call");

    var postData = {
        "recipe" : {
            "layers": {
                "streets": {
                    "source": sourcePath,
                    "minzoom": 0,
                    "maxzoom": 12
                }
            },
            "name": "Hanover-Streets",
            "version": 1
        },
        "name": "Hanover-Streets"
    };                    
                    
    var options = {
        host: api_url,
        path: api_uri,
        port: api_port,
        method: 'POST',
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

    req.write(JSON.stringify(postData));
    req.end();

};
