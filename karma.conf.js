// Karma configuration
// Generated on Fri Mar 07 2014 09:04:47 GMT-0600 (CST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    preprocessors: {
      // This doesn't need to be strict because we are strict in files:
      '**/*.html': ['ng-html2js']
    },


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'jquery/jquery-1.11.1.min.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/i18ng/i18ng.js',
      'bower_components/tether/tether.js',
      'bower_components/underscore/underscore.js',
      'bower_components/restangular/src/restangular.js',

      // Add templates (using ng-html2js)
      // Add everything, one page may use external directives
      './!(node_modules|*bower_components)/**/*.html',

      // App code
      'sport-ng.js',
      './!(node_modules|*bower_components)/**/!(*-test).js',

      // Test files
      './!(node_modules|*bower_components)/**/*-test.js'
    ],


    // list of files to exclude
    exclude: [
      //'node_modules/**'
    ],

    // Load templateUrls
    ngHtml2JsPreprocessor: {
      prependPrefix: '/bower_components/sport-ng/',
      moduleName: 'sport.ng.templates'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome', 'Firefox'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
