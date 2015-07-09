define(function (require) {

    var moment = require('moment-timezone'),
        accounting = require('accounting');

  var captureHelpers     = require('./helpers/capture-helpers'),
      formatHelpers      = require('./helpers/format-helpers'),
      groupingHelpers    = require('./helpers/grouping-helpers'),
      overrideHelpers    = require('./helpers/override-helpers');

  module.exports = {
    registerHelpers: function(templator) {
      captureHelpers.registerHelpers(templator);
      formatHelpers.registerHelpers(templator);
      groupingHelpers.registerHelpers(templator);
      overrideHelpers.registerHelpers(templator);
    },
    captureHelpers: captureHelpers,
    formatHelpers: formatHelpers,
    groupingHelpers: groupingHelpers,
    overrideHelpers: overrideHelpers
  };

});