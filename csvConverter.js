'use strict';

var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log('completed request');

    var s3 = new aws.S3();
            
    var getParams = {Bucket : 'for-richmond-data', Key : 'volunteers.csv'};
    //var getParams = {Bucket : 'for-richmond-data', Key : 'test.txt'};
                    
    s3.getObject(getParams, function(err, data) {
        if(err)
            console.log('Error getting csv data : ' + err);
        else {
            //var returnData = data.Body;
            var stringData = data.Body.toString();
            
            //console.log("data :" + returnData);

            var rows = stringData.split("\n");
            var columns = rows[1].split(",");
            var volunteer = {};
                volunteer.createDate = columns[0];
                volunteer.firstName = columns[1];
                volunteer.lastName = columns[2];
                volunteer.email = columns[3];
                volunteer.phone = columns[4];
                volunteer.addressStreet = columns[5];
                volunteer.addressCity = columns[6];
                volunteer.addressStateZipCountry = columns[7];
                volunteer.church = columns[8];
                volunteer.level = columns[9];
            
            //console.log(columns);
            console.log(volunteer);

            console.log("Retrieved Data");
        }
    });
};
