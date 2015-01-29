var envs = ['production', 'staging1', 'staging2', 'test']
var env = ~envs.indexOf(process.env.NODE_ENV) ? 'prod' : 'dev'

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }

  })

  grunt.registerTask('test',    ['karma'])
  grunt.registerTask('ci',      ['test'])
  grunt.registerTask('default', ['karma'])

  // load the grunt task plugins
  grunt.loadNpmTasks('grunt-karma')

}
