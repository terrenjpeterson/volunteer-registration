# Volunteer Registration and Map Management

This repo contains the code to automate and manage mapping data used to track volunteers around the Greater Richmond Region.

## How to build the initial map

City of Richmond Data

https://richmond-geo-hub-cor.hub.arcgis.com/datasets/centerlines
http://opengeospace.chesterfield.gov/datasets/
https://data-hanovercounty.hub.arcgis.com

Remove schema, change from KML to XML

XML to CSV Converter

https://www.convertcsv.com/xml-to-csv.htm

These files will be too large, need to then split (5 MB is the limit for uploading to Studio).

https://linoxide.com/linux-how-to/split-large-text-file-smaller-files-linux/

split -l 2000 chesterfield.csv

Upload these to S3 bucket.

Run conversion utility to transform to json format, automatically remove unwanted streets, add default block ownership.

creating LineString features.

The geometry attributes should look like this.

    "geometry": {
        "coordinates": [
            [
                -77.5668827039088,
                37.7489726056264
            ],
            [
                -77.5668839377692,
                37.7486775962941
            ],
            [
                -77.5669302049511,
                37.7479232847771
            ]
        ],
        "type": "LineString"
    },

http://geojsonlint.com

Then trying to create a properties object that can provide a description of which street it is. This is primarily the street name and number range.

This creates multiple geo-json objects (one for each source file).

Hanover Dataset
ck9zugz390eve2st7zggkymwl

Create an empty tileset with the API. This includes the recipe with the location of the dataset.
(createTileset.js)
Publish the tileset
curl -X POST "https://api.mapbox.com/tilesets/v1/{tileset}/publish?access_token=

Dowload these to your computer.

Use one file to seed a new dataset through Mapbox studio, then import the others into the same dataset.

## To get the API to work, need to first gather the datasets from Mapbox as we need the unique identifier for what is being updated.

Step 1 - Run getStreetData lambda function to pull data all of the features (blocks) from a specific dataset. 
Given limitations of the size of the files, will need to run this multiple times as the limit is around 2000 features in a single API call.

Step 2 - Copy the files from S3 to an EC2 host.

Step 3 - Run the merge script to combine into one.

Step 4 - At startup of the API it will read the files for the dataset.

## good references

Not in Philly

https://github.com/yurykorzun/notinphilly


## Key Mapbox Limitations

Mapbox Studio dataset editor can only display datasets of 20 MB or smaller. This is why these datasets have not been combined.

## How to update the map

To update the map using the mapbox API, the unique feature id is required to instruct Mapbox which entry should have it's properties update.
From the administrative app, the street address will be provided which is then used to search for a the unique feature id.
If the query was too vague and multiple features with the same information are found, instruct the user to provide more specifics and give an array with the options.
