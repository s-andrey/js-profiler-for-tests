module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        browser: true,
        jquery: true,
        node: true,
        eqeqeq: true,
        indent: 4,
        latedef: "nofunc",
        maxlen: 160,
        newcap: true,
        strict: false,
        undef: true,
        unused: false,
        eqnull: true,
      },
      '<%= pkg.name %>': {
        src: [ 'src/index.js']
      }
    },

    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
        '(function() {\n\n',
        footer: '\n\n})();'
      },
      dist: {
        src: [
          'src/index.js',
          'src/matrix.js',
        ],
        dest: 'dist/js-profiler-for-tests.js'
      }
    },

    uglify: {
      build: {
        src: 'dist/js-profiler-for-tests.js',
        dest: 'dist/js-profiler-for-tests.min.js'
      }
    },

    watch: {
      scripts: {
        files: ['src/*.js'],
        tasks: ['jshint']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('test', ['jshint']);

};
