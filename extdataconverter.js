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
            
            // start for loop at 1 to skip the header with column names
            for (var i = 1; i < rows.length; i++) {
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
                
                var geometryType = {};
                if (datapoints.length > 2) {
                    geometryType = "Polygon";
                } else {
                    geometryType = "LineString";
                }

                var geometry = {};
                if (geometryType == "Polygon") {
                    var geometryCoordinatesArray = [];
                        geometryCoordinatesArray.push(geometryCoordinates);
                    geometry.coordinates = geometryCoordinatesArray;
                } else {
                    geometry.coordinates = geometryCoordinates;
                }
                    geometry.type = geometryType;
                
                // parse out the line in the csv file
                var columns = components[0].split(",");
                var properties = {};
                    properties.volunteer = columns[16];

                // create an object and associate column names to attributes for the object
                var feature = {};
                    feature.type = "Feature";
                    feature.properties = properties;
                    feature.geometry = geometry;
                    feature.id = columns[1];

                console.log(JSON.stringify(feature));
                // push the new feature object into the array    
                masterArray.push(feature); 
            
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
