'use strict';

var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log('completed request');

    var s3 = new aws.S3();
            
    var getParams = {Bucket : 'for-richmond-data', Key : 'volunteers.geojson'};

    s3.getObject(getParams, function(err, data) {
        if(err)
            console.log('Error getting csv data : ' + err);
        else {
            console.log("Retrieved Data");
            var baseData = eval('(' + data.Body + ')');
            //console.log(data.Body.toString());
            console.log(JSON.stringify(baseData.features[0]));
        }
    });
};
