#! /bin/bash

echo $1 $2

git clone $1 ./elements/$2/$2
cd ./elements/$2/$2
polymer analyze > ../../../analysis/$2.json
bower i --force-latest
cd ../
mv $2/bower_components ./bower_components
mv $2 ./bower_components/$2
cd ../../

node -e "const a = require('./analysis/$2.json'); const fs = require('fs'); a.elements.forEach(el => {!!el.demos ? el.demos.forEach(demo => demo.url = 'elements/$2/bower_components/$2/' + demo.url) : null}); fs.writeFileSync('./analysis/$2.json', JSON.stringify(a))"
