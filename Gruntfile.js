/*
 * grunt-tpl-compiler
 * https://github.com/dickeylth/grunt-tpl-compiler
 *
 * Copyright (c) 2014 弘树
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    tpl_compiler: {
      default_options: {
        options: {
	        ext: '-tpl',
	        replaceEscapeMap: {
		        '\xB0': '&deg;'
	        }
        },
        files: {
          'tmp/default_options': ['test/fixtures/123']
        }
      },
      custom_options: {
        options: {
	        ext: '.tpl',
	        replaceEscapeMap: {
		        '\xB0': '&deg;',
		        '&lt;': "<"
	        }
        },
        files: {
          'tmp/custom_options': ['test/fixtures/123']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'tpl_compiler', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
