exports.handler = (event, context, callback) => {
    // this is the secure token - need to get this into a secrets manager
    const token = 'xxx';
    // this is the dataset id for the Richmond street data
    const datasetId = 'ck9haxjo108f72ln6v3skobfn';
    // this is the API endpoint for pulling a dataset from mapbox
    const featureId = '002b2ad7232ffc186a380ab5aa5acf92';
    //const featureId = '00133486c60d3318e04bcaf5acdec88c';
    const api_url = 'api.mapbox.com';
    const api_uri = '/datasets/v1/terren/' + datasetId + '/features/' + featureId + '?access_token=' + token;
    const api_port = 443;

    console.log("prepare update feature property API call");

    var postData = {
        "id": "002b2ad7232ffc186a380ab5aa5acf92", // unique identifier
        "type": "Feature",
        "properties": {
            "volunteerName": "Terren Peterson",
            "volunteerStatus": true
        },
        "geometry": {
            "type": "LineString",
	        "coordinates": [
		        [-77.45198, 37.563923],
		        [-77.451987, 37.564203],
		        [-77.451992, 37.564381]
	        ]
        }
    };
    
    var options = {
        host: api_url,
        path: api_uri,
        port: api_port,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log("Starting API call");    

    var req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
        var data = "";

        res.on('data', (d) => {
            console.log("data received:" + d);
            data += d;
        });
        res.on('error', (e) => {
            console.log("error received");
            console.error(e);
        });
        res.on('end', function() {
            console.log("ending post request");
        });
    });

    req.on('error', error => {
        console.log("exception found");
        console.error(error);
    });

    req.write(JSON.stringify(postData));
    req.end();
    
    req.end(JSON.stringify(postData));
};
