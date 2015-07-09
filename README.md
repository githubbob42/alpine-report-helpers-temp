# alpine-report-helpers-temp

A common code base for report helper modules for alpine-mobile and alpine/source/reporting, ...

## Getting Started
Install Dependencies

```term
$ sudo npm install -g browserify
$ npm install
```

I've create a `gen_bundle.sh` script that I used to generate the bundled code.  It uses `browserify` to do the bundling.


To generatet he bundle, run the following:
```term
./gen_bundle.sh
```
it will create a file under the `dist` folder called `dist/alpine-report-helpers.js`.  

If you call `gen_bundle.sh` with the `--copy` parameter
```term
./gen_bundle.sh --copy
```
it will copy the `dist/alpine-report-helpers.js` to both `../alpine-mobile/www/vendor/` and `../alpinereporting/assets/vendor/`.  This was useful for running the bundled package locally in both the `alpine-mobile` and `alpinereporting` environments.

