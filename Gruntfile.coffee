exclude = [
  '!**/.DS_Store'
  '!**/Thumbs.db'
  '!**/.gitignore'
]

module.exports = (grunt) ->
  pkg = grunt.file.readJSON 'package.json'
  grunt.initConfig
    pkg: pkg

    connect:
      livereload:
        options:
          hostname: '*'
          port:9000

    watch:
      html:
        files: ['*.html']
        options:
          livereload: true
          nospawn: true
      scripts:
        files: ['js/*.js']
        options:
          livereload: true
          nospawn: true
      stylesheets:
        files: ['css/*.css']
        options:
          livereload: true
          nospawn: true

  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-watch'


  grunt.registerTask 'live', [  'connect','watch' ]
  grunt.registerTask 'default', [ 'live' ]
