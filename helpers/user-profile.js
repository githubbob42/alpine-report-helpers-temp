define(function (require) {

  var store = require('system/store');
  var userprofile = {};
  var Reference = require('layout/reference');

  module.exports = {
    registerHelpers: function(templator) {
      templator.registerHelper('userProfile', function (field){
        return userprofile[field] || '';
      });
    },
    userprofile: userprofile,
    initialize: function(){
      userprofile = {};
      return store.fetch('shell:userprofile').then(function(profile){
        userprofile.UserName = profile.userName;
        userprofile.FullName = profile.name;
        userprofile.timezone = userprofile.TimeZone = profile.timezone;
        userprofile.locale = profile.locale;
        userprofile.Phone = profile.phone;
        userprofile.Email = profile.email;

        if (!profile.contactId) return userprofile;

        var reference = new Reference({ id: profile.contactId, field: { referenceTo: 'Contact' } });
        return reference.activate(function(match, metadata) {
          Object.keys(metadata.fields).forEach(function(fieldName) {
            var type = metadata.fields[fieldName].type,
                name = type === 'reference' ? match[fieldName + "Name"] : match[fieldName],
                nameProp = metadata.fields[fieldName].name;

            if (!userprofile.hasOwnProperty(nameProp)) {
              userprofile[nameProp] = name;
            }
          });
          return userprofile;
        });
      });
    }
  };
});