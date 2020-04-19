'use strict';

var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log('Begin Processing');

    var s3 = new aws.S3();
            
    var getParams = {Bucket : 'for-richmond-data', Key : 'volunteers.geojson'};

    s3.getObject(getParams, function(err, data) {
        if(err)
            console.log('Error getting base data : ' + err);
        else {
            console.log("Retrieved Base Data");
            var baseData = eval('(' + data.Body + ')');
            //console.log(JSON.stringify(baseData.features[0]));

            // now retrieve the volunteer data
            getParams.Key = 'volunteers.json';

            console.log("Retrieving Volunteer Data");

            s3.getObject(getParams, function(err, data) {
                if(err)
                    console.log('Error getting volunteer data : ' + err);
                else {
                    console.log("Retrieved Volunteer Data");
                    var volunteerData = eval('(' + data.Body + ')');
                    //console.log(JSON.stringify(volunteerData[0]));

                    var enrichedDataObject = {};
                    var enrichedGeoArray = [];

                    for (var j = 0; j < baseData.features.length; j++) {
                        var foundMatch = false;
                        console.log("Matching Data for " + JSON.stringify(baseData.features[j]));

                        for (var i = 0; i < volunteerData.length; i++) {
                            var enrichedGeoObject = {};

                            if (volunteerData[i].fullName == baseData.features[j].properties.volunteer) {
                                //console.log("found match for volunteer:" + JSON.stringify(volunteerData[i]));
                                //console.log("found match for volunteer number :" + j);
                                foundMatch = true;

                                // copy from base data for attributes that don't change
                                enrichedGeoObject.type = baseData.features[j].type;

                                // create new enriched data properties
                                var properties = {};
                                    properties.volunteer = volunteerData[i].fullName;
                                    properties.email = volunteerData[i].email;
                                    properties.phone = volunteerData[i].phone;
                                    //properties.addressStreet = volunteerData[i].addressStreet;
                                    //properties.addressCity = volunteerData[i].addressCity;
                                    properties.church = volunteerData[i].church;
                                    properties.level = volunteerData[i].level;
                                if (baseData.features[j].geometry.type == "LineString") {
                                //    properties.mapLocation = baseData.features[j].geometry.coordinates
                                    properties.mapLocation = baseData.features[j].geometry.coordinates[0];
                                } else {
                                    properties.mapLocation = baseData.features[j].geometry.coordinates[0][0];
                                }
                                //console.log("Map Location :" + properties.mapLocation);
                                
                                // now add the enriched properties
                                enrichedGeoObject.properties = properties;

                                // copy from base data for attributes that don't change
                                enrichedGeoObject.geometry = baseData.features[j].geometry;
                                enrichedGeoObject.id = baseData.features[j].id;
                                
                                // now push to array
                                enrichedGeoArray.push(enrichedGeoObject);
                                //console.log("New Enriched Data Object:" + JSON.stringify(enrichedGeoObject));
                            }
                        }
                        if (!foundMatch) {
                            console.log("Error - No match found for " + baseData.features[j].properties.volunteer);
                        }
                    }
                    console.log("all done");
                    console.log("Array Created with " + enrichedGeoArray.length + " entries.");
                    
                    enrichedDataObject.type = "FeatureCollection";
                    enrichedDataObject.features = enrichedGeoArray;
                    //console.log("New Enriched Data:" + JSON.stringify(enrichedDataObject));

                    var postData = JSON.stringify(enrichedDataObject);
                    
                    var putParams = {Bucket : 'for-richmond-data',
                                    Key : 'enrichedvolunteers.geojson',
                                    Body: postData};
                                    
                    s3.putObject(putParams, function(err, data) {
                        if(err)
                            console.log('Error posting data' + err);
                        else
                            console.log('Successfully posted data');
                    });
                }
            });
        }
    });
};

