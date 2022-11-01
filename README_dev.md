# ioBroker.anelhut Dev Instructions

## Build

npm run build

## Test

npm run test

## Release & Publish

Increase Version number in package.json
Increase Version number in io-package.json and add releasenotes for this version in the "news" section

npm run translate
Build again with npm run build
npm publish
