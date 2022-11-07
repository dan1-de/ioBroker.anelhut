# ioBroker.anelhut Dev Instructions

## Build

npm run build

## Test

npm run test

## Release & Publish Checklist

Increase Version number in package.json
Increase Version number in io-package.json and add releasenotes for this version in the "news" section
Increase Version number in index_m.html
Add Releasenotes to Readme.md

npm run translate
Build again with npm run build
npm publish

## Manual installation Dev Branch

Use Dev Tarball from this url: https://github.com/dan1-de/ioBroker.anelhut/tarball/dev
