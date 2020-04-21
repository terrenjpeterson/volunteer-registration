'use strict';

const https = require('https');
var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    const token = 'xxx';
    // this is the dataset id for block level data being authored into mapbox studio
    const datasetId = 'ck8tgcf9c00tk2lplferm1eaj';
    const APIurl = 'https://api.mapbox.com/datasets/v1/terren/' + datasetId + '/features?access_token=' + token;

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
            //var returnData = eval('(' + tempData.toString('utf8') + ')');
            //console.log(JSON.stringify(returnData));
            console.log(returnData.slice(0,100));

            var blockData = eval('(' + returnData + ')');
            
            for (var i = 1; i < blockData.features.length; i++) {
                console.log(blockData.features[i].properties.volunteer);
            }            

            console.log("Successfully retrieved " + blockData.features.length + " records.");
            
            var s3 = new aws.S3();

            var putParams = {Bucket : 'for-richmond-data',
                            Key : 'volunteers.geojson',
                            Body: returnData};
                            
            s3.putObject(putParams, function(err, data) {
                if(err)
                    console.log('Error posting data' + err);
                else
                    console.log('Successfully posted data to s3' );
            });                            
            
        });
    }).on('error', (e) => {
        console.error(e);
    });
};
