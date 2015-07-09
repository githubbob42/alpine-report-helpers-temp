define(function (require) {
    "use strict";

    var accounting = require('accounting'),
        ko = require('knockout');
    
    function _isDefined(value) {
        return value !== undefined;
    }

    function _resolveField(fieldInfo, context){
        var fieldContext = context;
        for(var i=0, length = fieldInfo.length; i < length; i++){
            fieldContext = fieldContext[fieldInfo[i]];
            if (!_isDefined(fieldContext)) return;
        }
        return fieldContext;
    }

    function getSortMethod(items, sortBy, desc) {
        function sortNumeric(a,b) { 
            return desc ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]; 
        }
        function sortAlpha(a,b) {
            return desc ? b[sortBy] && b[sortBy].localeCompare(a[sortBy]) : a[sortBy] && a[sortBy].localeCompare(b[sortBy]); 
        }
        function sortComplex(a,b) {
            return desc ? b[sortBy].value - a[sortBy].value : a[sortBy].value - b[sortBy].value; 
        }

        var sortMethod = sortAlpha;
        var firstItem = ko.utils.arrayFirst(items, function(item) { return !!item[sortBy]; });

        if (firstItem) {
            var firstValue = firstItem[sortBy];
            if (typeof firstValue === 'number') sortMethod = sortNumeric;
            if (SalesforceDate && firstValue instanceof SalesforceDate) sortMethod = sortComplex;
        }

        return sortMethod;
    }

    module.exports = {
        registerHelpers: function(templator, SalesForceDate) {
            templator.registerHelper('sum', function(items, field, options){
                if (!field || !options) return "{error}";

                if (typeof items === 'undefined') return "";
                
                var fieldInfo = field.split('.');

                var value = items.reduce(function(total, item){
                    total += _resolveField(fieldInfo, item) || 0;
                    return total;
                },0);

                return accounting.formatMoney(value, options.hash.symbol || '', options.hash.precision || 2, options.hash.seperator || ',', options.hash.decimal || '.');
            });

            templator.registerHelper('avg', function(items, field, options){
                if (!field || !options) return "{error}";

                if (typeof items === 'undefined' || items.length === 0) return "";

                var fieldInfo = field.split('.');

                var avg = items.reduce(function(total, item) {
                    total += Number(_resolveField(fieldInfo, item)) || 0;
                    return total;
                }, 0) / items.length;

                if (isNaN(avg)) return "";

                return accounting.formatMoney(avg, options.hash.symbol || '', options.hash.precision || 2, options.hash.seperator || ',', options.hash.decimal || '.');
            });

            templator.registerHelper('sort', function(items, by, options){
                if(!items || !by || !options) return "{error}";

                var desc = options.hash && options.hash.desc,
                    sortMethod = getSortMethod(items, by, desc, SalesforceDate);

                var ret = items
                    .map(function copy(item) { 
                        return item; 
                    })
                    .sort(sortMethod)
                    .reduce(function render(result, item){
                        result += options.fn(item);
                        return result;
                    },'');
                return ret;
            });

            templator.registerHelper('group', function(items, by, options){
                if (!by || !options)
                    return "{error}";
                
                if (!items) items = [];
                var sortBy = options.hash && options.hash.sortBy;
                var desc = options.hash && options.hash.desc;

                var fieldCollection = by.split(' ').map(function(fieldInfo) {
                    return fieldInfo.split('.');
                });

                var findGroup = function(collection, item) {
                    var result = collection.filter(function(grp) {
                        return fieldCollection.every(function(fieldInfo){
                            return _resolveField(fieldInfo, item) === grp[fieldInfo.join('_')];
                        });
                    });
                    return !!result.length ? result[0] : null;
                };

                var groups = items.reduce(function(collection, item){
                    var g = findGroup(collection, item);

                    if (!g) {
                        g = {};
                        for(var p=0, glen = fieldCollection.length; p < glen; p++) {
                            g[fieldCollection[p].join('_')] = _resolveField(fieldCollection[p], item);
                        }
                        g.items = [];
                        collection.push(g);
                    }
                    g.items.push(item);

                    return collection;
                }, []);

                if (sortBy) {
                    var sortMethod = getSortMethod(groups, sortBy, desc);
                    groups = groups.sort(sortMethod);
                }

                var ret = "";
                for(var g=0, length = groups.length; g < length; g++){
                    ret = ret + options.fn(groups[g]);
                }
                return ret;
            });

            templator.registerHelper('filter', function(items, by, options){
                if (!by || !options)
                    return "{error}";
                
                if (!items) items = [];

                var fieldinfo = by.split('.');

                var is = options.hash.is;
                var not = options.hash.not;
                var re = options.hash.pattern ? new RegExp(options.hash.pattern) : null;

                var resultItems = [];
                for(var i=0, length = items.length; i < length; i++){
                    var field = _resolveField(fieldinfo, items[i]);
                    if (_isDefined(not) && field === not) continue;

                    if ((_isDefined(is) && field === is) || (_isDefined(not) && not !== field) || (re && re.test(field)))
                        resultItems.push(items[i]);
                }
                return options.fn({items: resultItems});
            });
        }
    };
});