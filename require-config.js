require.config({
  paths: {
    'knockout': '../vendor/knockout-3.3.0',
    'text': '../vendor/require/text',
    'handlebars' : '../vendor/handlebars',
    'accounting' : '../vendor/accounting.min',
    'moment': '../vendor/moment-with-locales.min',
    'moment-timezone': '../vendor/moment-timezone-with-data.min'
  },
  shim: {
    handlebars: { exports: 'Handlebars'}
  }
});