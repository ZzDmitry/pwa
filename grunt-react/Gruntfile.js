module.exports = function (grunt) {
  'use strict';
  grunt.initConfig({
    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['transform-es2015-modules-amd']
      },
      dist: {
        files: [{
          expand: true,
          cwd: './src',
          src: ['*.js'],
          dest: './generated',
          ext: '.js'
        }]
      }
    },
    browserify: {
      dev: {
        files: {
          'build/app.js': ['src/index.js']
        },
        options: {
          transform: [
            'babelify', 'reactify'
          ]
        },
      }
    },
  });
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['browserify']);
};
