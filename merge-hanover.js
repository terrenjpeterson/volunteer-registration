#!/user/bin/env node

// include the required node.js packages

var fs = require('fs');
var AWS = require('aws-sdk');
    AWS.config.update({region:'us-east-2'});

// read the raw local files that will be merged

var blockRawData_01 = fs.readFileSync('data/Hanover-blockData-01.geojson', 'utf8');
var blockRawData_02 = fs.readFileSync('data/Hanover-blockData-02.geojson', 'utf8');
var blockRawData_03 = fs.readFileSync('data/Hanover-blockData-03.geojson', 'utf8');
var blockRawData_04 = fs.readFileSync('data/Hanover-blockData-04.geojson', 'utf8');
var blockRawData_05 = fs.readFileSync('data/Hanover-blockData-05.geojson', 'utf8');
var blockRawData_06 = fs.readFileSync('data/Hanover-blockData-06.geojson', 'utf8');
var blockRawData_07 = fs.readFileSync('data/Hanover-blockData-07.geojson', 'utf8');

// this loads block level data
console.log("Loading Block Level Data");
var blockData = {};
    blockData.type = "FeatureCollection";
var featureArray = [];
var blockData01 = eval('(' + blockRawData_01 + ')');
var blockData02 = eval('(' + blockRawData_02 + ')');
var blockData03 = eval('(' + blockRawData_03 + ')');
var blockData04 = eval('(' + blockRawData_04 + ')');
var blockData05 = eval('(' + blockRawData_05 + ')');
var blockData06 = eval('(' + blockRawData_06 + ')');
var blockData07 = eval('(' + blockRawData_07 + ')');

for (var j = 0; j < blockData01.features.length; j++) {
  featureArray.push(blockData01.features[j]);
}

console.log("Completed File 1. " + featureArray.length + " records processed.");

for (var j = 0; j < blockData02.features.length; j++) {
  featureArray.push(blockData02.features[j]);    
}

console.log("Completed File 2. " + featureArray.length + " records processed.");

for (var j = 0; j < blockData03.features.length; j++) {
  featureArray.push(blockData03.features[j]);    
}

console.log("Completed File 3. " + featureArray.length + " records processed.");

for (var j = 0; j < blockData04.features.length; j++) {
  featureArray.push(blockData04.features[j]);    
}

console.log("Completed File 4. " + featureArray.length + " records processed.");

for (var j = 0; j < blockData05.features.length; j++) {
  featureArray.push(blockData05.features[j]);    
}

console.log("Completed File 5. " + featureArray.length + " records processed.");

for (var j = 0; j < blockData06.features.length; j++) {
  featureArray.push(blockData06.features[j]);    
}

console.log("Completed File 6. " + featureArray.length + " records processed.");

for (var j = 0; j < blockData07.features.length; j++) {
  featureArray.push(blockData07.features[j]);    
}

console.log("Completed File 7. " + featureArray.length + " records processed.");

blockData.features = featureArray;

console.log("First Record");
console.log(blockData.features[0].properties);
console.log("Total Records: " + blockData.features.length);

var blockRawData_Merge = fs.writeFileSync('data/Hanover-blockData.geojson', JSON.stringify(blockData), 'utf8');
