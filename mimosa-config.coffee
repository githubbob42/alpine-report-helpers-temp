exports.config =
  minMimosaVersion:'2.1.22'

  modules: ['copy', 'sass', 'require', 'minify', 'live-reload', 'combine', 'requirebuild-textplugin-include', 'requirebuild-include']

  combine:
    removeCombined:
      enabled:true

  copy:
    extensions: ['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'ico', 'html', 'eot', 'svg', 'ttf', 'woff', 'json', 'xml', 'manifest', 'webapp']

  watch:
    sourceDir: 'www'
    compiledDir: 'dist'
    javascriptDir: 'app'

  vendor:
    javascripts:'vendor'
    stylesheets:'content/vendor'

  requireBuildTextPluginInclude:
    pluginPath: 'text'
    extensions: ['html']

  requireBuildInclude:
    patterns: ['viewmodels/**/*.js', 'readmodels/**/*.js', 'eforms/**/*.js', 'ticket/**/*.js', 'print/**/*.js', 'job/**/*.js', 'store/**/*.js', 'dashboard/**/*.js', 'attachments/**/*.js']

  require:
    optimize:
      overrides:
        name: '../vendor/require/almond-custom'
        mainConfigFile: 'www/app/require-config.js',
        inlineText: true
        stubModules: ['text']
        paths:
          text: '../vendor/require/text'