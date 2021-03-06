/*
 * grunt-tpl-compiler
 * https://github.com/dickeylth/grunt-tpl-compiler
 *
 * Copyright (c) 2014 弘树
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var program = require("ast-query");
var juicer = require('juicer');
var cheerio = require('cheerio');

module.exports = function (grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('tpl_compiler', 'Grunt plugin for juicer-based template compile to kissy module', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			ext: '-tpl'
		});

		var jsTpl = fs.readFileSync(path.join(__dirname, './template.js.tpl')).toString();

		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			// Concat specified files.
			var src = f.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
				// Read file source.
				return grunt.file.read(filepath);
			});

			// cheerio 解析模板所在 HTML 的 DOM
			src = src.join('');
			var $ = cheerio.load(src, {
				normalizeWhitespace: true,
				decodeEntities: false,
				lowerCaseAttributeNames: false
			});

			// 获取各个指定的模板
			var templates = [];
			$('[data-tpl]').each(function(idx, node){
				var tplKey = $(node).attr('data-tpl');
				var tplValue = $(node).html();
				templates.push({
					key: tplKey,
					value: tplValue
				});
			});

			var srcPath = f.src;
			if (Array.isArray(srcPath)) {
			  srcPath = srcPath[0];
      }

			var basename = path.basename(srcPath),
				dirname = path.dirname(srcPath),
				toFileName = basename.split('.')[0] + options.ext + '.js',
				toFilePath = path.join(dirname, toFileName);

			if(!fs.existsSync(toFilePath)){

				// 如果是初次生成对应 js 文件

				// 与 模板 js 合并
				juicer.set('strip',false);
				var toJsContent = juicer(jsTpl, {
					templates: templates,
					page: basename
				});

				// Write the destination file.
				grunt.file.write(toFilePath, toJsContent);

				// Print a success message.
				grunt.log.writeln('File "' + toFilePath + '" created.');

			} else {

				var curJsContent = fs.readFileSync(toFilePath).toString(),
					template = "{{@each templates as template, idx}" +
						"${template.key}: '$${template.value}'" +
						"{@if idx != (templates.length - 1)},{@/if}" +
						"{@/each}}";

				if(curJsContent) {

					var tree = program(curJsContent);
					tree.var('templates').value(juicer(template, {
						templates: templates
					}));

					grunt.file.write(toFilePath, tree.toString());

					// Print a success message.
					grunt.log.writeln('File "' + toFilePath + '" updated.');
				}

			}

		});
	});

};
