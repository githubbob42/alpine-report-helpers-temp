define(function (require) {
    "use strict";

    var moment = require('moment-timezone'),
        accounting = require('accounting');

    function constructDate(field, locale) {
        if(!field) return '';

        var dateValue = field.hasOwnProperty('value') ? field.value : field;
        if(!dateValue) return '';
        dateValue = Math.round(dateValue * 1000 * 60 * 60 * 24);

        dateValue = moment.utc(dateValue);
        if (locale) dateValue.locale(locale);
        return dateValue;
    }

    module.exports = {
        registerHelpers: function(templator) {
            templator.registerHelper('formatCurrency', function (currencyValue, options){
                if (options.hash.hasOwnProperty('emptyValue') && (currencyValue === null || currencyValue === undefined)) 
                    return options.hash.emptyValue;

                var d = options.hash.precision || 2;
                var m = Math.pow(10, d);
                var n = +(d ? currencyValue * m : currencyValue).toFixed(8); // Avoid rounding errors
                var i = Math.floor(n), f = n - i;
                var r = (f === 0.5) ? ((i % 2 === 0) ? i : i + 1) : Math.round(n);
                var result = d ? r / m : r;
                return accounting.formatMoney(result,options.hash.symbol || '', d, options.hash.seperator || ',', options.hash.decimal || '.');
            });

            templator.registerHelper('formatPercent', function(field, options){
                if(!field) return '';

                var d = (options && options.hash && options.hash.decimalPlaces) || 2;
                return (field*100).toFixed(d) + '%';
            });

            templator.registerHelper('formatDate', function(field, options){
                var format = options && options.hash && options.hash.format || "L",
                    locale = options && options.hash && options.hash.locale ? options.hash.locale : this.locale;

                var utcValue = constructDate(field, locale);
                if (!utcValue) return '';

                return utcValue.format(format);
            });

            templator.registerHelper('formatDateTime', function(field, options){
                var format = options && options.hash && options.hash.format || "L LT",
                    locale = options && options.hash && options.hash.locale ? options.hash.locale : this.locale,
                    timezone = options && options.hash && options.hash.timezone ? options.hash.timezone : this.timezone;

                var utcValue = constructDate(field, locale);
                if (!utcValue) return '';

                var dateTimeValue = timezone ? utcValue.tz(timezone) : utcValue.local();
                return dateTimeValue.format(format);
            });
        }
    };
});