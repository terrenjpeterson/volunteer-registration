'use strict';

var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log('converter initiated');

    var s3 = new aws.S3();

    // set parameters to where the source csv file is            
    var getParams = {Bucket : 'for-richmond-data', Key : 'volunteers.csv'};

    // get the s3 data object based on the parameters
    s3.getObject(getParams, function(err, data) {
        if(err)
            console.log('Error getting csv data : ' + err);
        else {
            var stringData = data.Body.toString();
            // parse out each row in the csv file into an array
            var rows = stringData.split("\n");
            
            // create master array object
            var masterArray = [];
            
            // start for loop at 1 to skip the header with column names
            for (var i = 1; i < rows.length; i++) {
                // parse out the line in the csv file
                var columns = rows[i].split(",");
                
                // create an object and associate column names to attributes for the object
                var volunteer = {};
                    volunteer.createDate = columns[0];
                    volunteer.firstName = columns[1];
                    volunteer.lastName = columns[2];
                    volunteer.fullName = columns[1] + ' ' + columns[2];
                    volunteer.email = columns[3];
                    volunteer.phone = columns[4];
                    volunteer.addressStreet = columns[5];
                    volunteer.addressCity = columns[6];
                    volunteer.addressStateZipCountry = columns[7];
                    volunteer.church = columns[8];
                    volunteer.level = columns[9];

                // push the new volunteer object into the array    
                masterArray.push(volunteer); 
            
                //console.log(columns);
                console.log("Volunteer " + i + " " + JSON.stringify(volunteer));
            }
            console.log("Full Array:" + JSON.stringify(masterArray));

            console.log("Array Created with " + masterArray.length + " entries.");
            
            var postData = JSON.stringify(masterArray);
            
            var putParams = {Bucket : 'for-richmond-data',
                            Key : 'volunteers.json',
                            Body: postData};

            s3.putObject(putParams, function(err, data) {
                if(err)
                    console.log('Error posting data' + err);
                else
                    console.log('Successfully posted data' + putParams.Body);
            });
        }
    });
};
