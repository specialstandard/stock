module.exports = function(grunt){

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-jade');

  grunt.registerTask('default', ['newer:jade', 'watch:jade']);
  grunt.registerTask('watch1', ['newer:jade', 'watch:jade']);
  grunt.registerTask('concat1', ['concat']);
  grunt.registerTask('jade1', ['newer:jade1']);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: ['app.js', 'src/*.js'],
        dest: 'app_in.js'
        }
    },
    jade: {
        compile: {
            options: {
                client: false,
                pretty: true
            },
            files: [ {
              cwd: "",
              src: ["**/*.jade", "!node_modules/**"],
              dest: "",
              expand: true,
              ext: ".html"
            } ]
        }
    },

    watch: {
      jade:{
        files: ['**/*.jade'],
        tasks: ['newer:jade']
      },
      concat: {
        files: ['app.js', 'src/*.js'],
        tasks: ['concat']
      }
    }
  });
}
