'use strict';

const https = require('https');
var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log("event data :" + JSON.stringify(event));
    console.log("context data :" + JSON.stringify(context));
    // this is the secure token - need to get this into a secrets manager
    const token = '';
    // this is the dataset id for the outlines of the regions that were written in Mapbox
    const datasetId = 'cka9n9bqy0gfa29s0xjze0wti'; // Region Outline Data
    // this is the API endpoint for pulling a dataset from mapbox
    const lastId = '';
    const APIurl = 'https://api.mapbox.com/datasets/v1/terren/' + datasetId + '/features?limit=1500&' + 'start=' + lastId + '&access_token=' + token;

    console.log("Starting API call");    
    https.get(APIurl, (res) => {
        console.log('API Call HTTP Code: ', res.statusCode); // this indicates if the HTTP request was valid

        var tempData = "";

        res.on('data', (d) => {
            tempData += d;
        });
        
        // this is the logic that gets executed once a successful API call is completed
        res.on('end', (d) => {
            console.log('completed request');
            // now process data returned from the API call
            var returnData = tempData.toString('utf8');

            var blockData = eval('(' + returnData + ')');
            
            console.log("Number of Blocks: " + blockData.features.length);
            console.log("Last Feature Id: " + blockData.features[blockData.features.length - 1].id);

            var s3 = new aws.S3();

            var putParams = {Bucket : 'for-richmond-data',
                            Key : 'RegionData.geojson',
                            Body: returnData};
                            
            s3.putObject(putParams, function(err, data) {
                if(err)
                    console.log('Error posting data' + err);
                else
                    console.log('Successfully posted data' );
            });                            
            
        });
    }).on('error', (e) => {
        console.error(e);
    });
};
