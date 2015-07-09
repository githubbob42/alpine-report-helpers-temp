define(function (require) {
  "use strict";

  var signatureBlockTemplate = require('../views/signature-block.html'),
      captureImageTemplate = require('../views/capture-image.html');

  module.exports = {
    registerHelpers: function(templator) {
      templator.registerHelper('signatureBlock', function(){
        return signatureBlockTemplate;
      });

      templator.registerHelper('captureImage', function(){
        return captureImageTemplate;
      });
    }
  };
});