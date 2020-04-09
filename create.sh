#!/bin/bash
# create new environment

# copying repo from github
echo 'copying repo from github'
git clone https://github.com/terrenjpeterson/volunteer-registration
echo 'repo loaded'

# installing npm packages
echo 'installing express'
npm install express

echo 'installing forever'
npm install forever

echo 'installing aws sdk'
npm install aws-sdk

# now start the application
echo 'go into repo directory'
cd volunteer-registration

echo 'start node server'
forever start app.js
