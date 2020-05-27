#!/bin/bash

# move to data directory
cd data

# copy from s3 bucket
echo 'copying first file'
aws s3 cp s3://for-richmond-data/Hanover-blockData-01.geojson Hanover-blockData-01.geojson

echo 'copying second file'
aws s3 cp s3://for-richmond-data/Hanover-blockData-02.geojson Hanover-blockData-02.geojson

echo 'copying third file'
aws s3 cp s3://for-richmond-data/Hanover-blockData-03.geojson Hanover-blockData-03.geojson

echo 'copying fourth file'
aws s3 cp s3://for-richmond-data/Hanover-blockData-04.geojson Hanover-blockData-04.geojson

echo 'copying fifth file'
aws s3 cp s3://for-richmond-data/Hanover-blockData-05.geojson Hanover-blockData-05.geojson

echo 'copying sixth file'
aws s3 cp s3://for-richmond-data/Hanover-blockData-06.geojson Hanover-blockData-06.geojson

echo 'copying seventh file'
aws s3 cp s3://for-richmond-data/Hanover-blockData-07.geojson Hanover-blockData-07.geojson

echo 'file copying completed'
