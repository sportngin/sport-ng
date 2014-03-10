var envs = ['production', 'staging1', 'staging2', 'test']
var env = ~envs.indexOf(process.env.NODE_ENV) ? 'prod' : 'dev'

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    "bower-install": {

      target: {

        // Point to the files that should be updated when
        // you run `grunt bower-install`
        src: [

        ],

        // Optional:
        // ---------
        cwd: '',
        dependencies: false,
        devDependencies: true,
        exclude: [],
        fileTypes: {},
        ignorePath: ''
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        runnerPort: 9999,
        singleRun: true
      }
    }

  })

  // Default task.
  // put require before handlebars because require wipes the dir

  grunt.registerTask('setup',   ['npm-install', 'bower-install'])
  grunt.registerTask('test',    ['karma'])
  grunt.registerTask('ci',      ['test'])

  // load the grunt task plugins
  grunt.loadNpmTasks('grunt-bower-install')
  grunt.loadNpmTasks('grunt-npm-install');
  grunt.loadNpmTasks('grunt-karma')

}
