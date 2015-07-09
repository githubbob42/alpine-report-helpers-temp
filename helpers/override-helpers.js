define(function () {
  "use strict";

  var operators = {
    '==':       function(l,r) { /*jshint eqeqeq:false */ return l == r; },
    '===':      function(l,r) { return l === r; },
    '!=':       function(l,r) { /*jshint eqeqeq:false */ return l != r; },
    '!==':      function(l,r) { return l !== r; },
    '<':        function(l,r) { return l < r; },
    '>':        function(l,r) { return l > r; },
    '<=':       function(l,r) { return l <= r; },
    '>=':       function(l,r) { return l >= r; },
    '&&':       function(l,r) { return l && r; },
    '||':       function(l,r) { return l || r; }
  };

  function _parseArgs(){
    var args = { error: null };

    switch (arguments.length) {
      case 2:
        args.defaultBehaviour = true;
        args.value = arguments[0];
        args.options = arguments[1];
        break;
      
      case 4:
        args.defaultBehaviour = false;
        args.lvalue = arguments[0];
        args.operator = arguments[1];
        args.rvalue = arguments[2];
        args.options = arguments[3];
        if (!operators[args.operator]) {
          args.error = "{error: Handlerbars Helper 'if' doesn't know the operator " + args.operator + " }";
        }
        if (args.lvalue === undefined) args.lvalue = null;
        if (args.rvalue === undefined) args.rvalue = null;
        break;

      default:
        args.error = "{error: Handlerbars Helper 'if' expects either a sinlge boolean value {{#if value }}, or a leftside value, an operator and a rightside value: {{#if lvalue '==' rvalue }} }";
    }

    return args;
  }

  // return {
  module.exports = {
    registerHelpers: function(templator) {

      templator.registerHelper('if', function() {
        var result = null,
            args = _parseArgs.apply(null, arguments);
        
        if (args.error) return args.error;

        if (args.defaultBehaviour) {
          result = ((args.value instanceof Array ? args.value.length : args.value) ? true : false);
        } else {
          result = operators[args.operator](args.lvalue, args.rvalue);
        }

        if (result) {
          return args.options.fn(this);
        } else {
          return args.options.inverse(this);
        }

      });
    }
  };
});