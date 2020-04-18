'use strict';

var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log('completed request');

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

            console.log("Retrieving Volunteer Data")

            s3.getObject(getParams, function(err, data) {
                if(err)
                    console.log('Error getting volunteer data : ' + err);
                else {
                    console.log("Retrieved Volunteer Data");
                    var volunteerData = eval('(' + data.Body + ')');
                    //console.log(JSON.stringify(volunteerData[0]));

                    console.log("Matching Data for " + JSON.stringify(baseData.features[0]));

                    var enrichedGeoData = {};

                    for (var j = 0; j < baseData.features.length; j++) {
                        for (var i = 0; i < volunteerData.length; i++) {
                            //console.log("matching:" + volunteerData[i].fullName);
                            if (volunteerData[i].fullName == baseData.features[j].properties.volunteer) {
                                console.log("found match");
                                console.log("volunteer:" + JSON.stringify(volunteerData[i]));

                                // copy from base data for attributes that don't change
                                enrichedGeoData.type = baseData.features[j].type;

                                // create new enriched data properties
                                var properties = {};
                                    properties.volunteer = volunteerData[i].fullName;
                                    properties.email = volunteerData[i].email;
                                    properties.phone = volunteerData[i].phone;
                                    properties.addressStreet = volunteerData[i].addressStreet;
                                    properties.addressCity = volunteerData[i].addressCity;
                                    properties.church = volunteerData[i].church;
                                    properties.level = volunteerData[i].level;

                                // now add the enriched properties
                                enrichedGeoData.properties = properties;

                                // copy from base data for attributes that don't change
                                enrichedGeoData.geometry = baseData.features[j].geometry;
                                enrichedGeoData.id = baseData.features[j].id;
                                
                                console.log("Enriched Data:" + JSON.stringify(enrichedGeoData));
                            }
                        }
                    }
                }
            });
        }
    });
};

