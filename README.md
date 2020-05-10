# volunteer-registration

## how to build layer

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

## good references

Not in Philly

https://github.com/yurykorzun/notinphilly
