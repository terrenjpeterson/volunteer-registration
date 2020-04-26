# volunteer-registration

## how to build layer

City of Richmond Data

https://richmond-geo-hub-cor.hub.arcgis.com/datasets/centerlines

Remove schema, change from KML to XML

XML to CSV Converter

https://www.convertcsv.com/xml-to-csv.htm

These files will be too large, need to then split (5 MB is the limit for uploading to Studio).

Upload these to S3 bucket.

Run conversion utility to transform to json format, automatically remove unwanted streets, add default block ownership.

This creates multiple geo-json objects (one for each source file).

Dowload these to your computer.

Use one file to seed a new dataset through Mapbox studio, then import the others into the same dataset.

## good references

Not in Philly

https://github.com/yurykorzun/notinphilly
