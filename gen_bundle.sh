#!/bin/bash

if [ ! -d "dist" ]
then
  mkdir dist;
fi

browserify index.js --standalone reportHelpers \
  -x "user-profile" -x "system/store" -x "layout/reference" -x "salesforce/date" \
  -x "knockout" \
  -x "moment-timezone" -x "moment" -x "accounting" \
> dist/alpine-report-helpers.js


cp dist/alpine-report-helpers.js ../alpine-mobile/www/vendor/
cp dist/alpine-report-helpers.js ../alpinereporting/assets/vendor/


