'use strict';

var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log('converter initiated');

    var s3 = new aws.S3();

    // set parameters to where the source csv file is            
    var getParams = {Bucket : 'for-richmond-data', Key : 'streets_richmond.csv'};

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

            console.log("file length :" + rows.length);

            var fileLength = (rows.length - 1);
            
            // start for loop at 1 to skip the header with column names
            for (var i = 1; i < fileLength; i++) {
                //console.log("row data:" + rows[i]);
                
                var components = rows[i].split("\"");
                var datapoints = components[1].split(" ");

                var geometryCoordinates = [];
                for (var j = 0; j < datapoints.length; j++) {
                    var location = datapoints[j].split(",");
                    var position = [];
                        position.push(parseFloat(location[0]));
                        position.push(parseFloat(location[1]));
                    geometryCoordinates.push(position);
                }
                //console.log("geometry :" + JSON.stringify(geometryCoordinates));

                var geometry = {};
                    geometry.coordinates = geometryCoordinates;
                    geometry.type = "LineString";
                
                // parse out the line in the csv file
                var columns = components[0].split(",");
                //console.log(columns);
                var streetNumbers = components[2].split(",");
                //console.log(streetNumbers);
                
                var properties = {};
                    properties.streetType = columns[9];
                    properties.functionalClass = columns[11];
                    properties.streetName = columns[27];
                    properties.leftFromAddress = streetNumbers[1];
                    properties.leftToAddress = streetNumbers[2];
                    properties.rightFromAddress = streetNumbers[3];
                    properties.rightToAddress = streetNumbers[4];

                // create an object and associate column names to attributes for the object
                var feature = {};
                    feature.type = "Feature";
                    feature.properties = properties;
                    feature.geometry = geometry;
                    feature.id = columns[5];

                console.log(JSON.stringify(feature));
                // push the new feature object into the array
                if (properties.streetType !== "Alley") {
                    masterArray.push(feature);
                } else {
                    console.log("skipping alley");
                }
            }
            console.log("Full Array:" + JSON.stringify(masterArray));

            console.log("Array Created with " + masterArray.length + " entries.");
            
            var masterObject = {};
                masterObject.type = "FeatureCollection";
                masterObject.features = masterArray;
                
            console.log(JSON.stringify(masterObject));
            
            var postData = JSON.stringify(masterObject);
            
            var putParams = {Bucket : 'for-richmond-data',
                            Key : 'richmondTest.geojson',
                            Body: postData};

            s3.putObject(putParams, function(err, data) {
                if(err)
                    console.log('Error posting data' + err);
                else
                    console.log('Successfully posted data');
            });
        }
    });
};
