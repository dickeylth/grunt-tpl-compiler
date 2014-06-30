# grunt-tpl-compiler

> Grunt plugin for juicer-based template compile to kissy module
> 
> 将基于 [juicer](http://juicer.name) 语法的模板文件编译为 KISSY 模块。

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-tpl-compiler --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-tpl-compiler');
```

## The "tpl_compiler" task

### Overview
In your project's Gruntfile, add a section named `tpl_compiler` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  tpl_compiler: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.ext
Type: `String`
Default value: `'tpl'`

生成 js 文件的后缀字符串

#### options.replaceEscapeMap
Type: `Object`
Default value: 

	{
		'&lt;': '<',
		'&gt;': '>',
		‘&amp’: '&',
		'\xA5': '&yen;',
		'\xA9': '&copy;'
	}

处理 html 压缩时带上的转义

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  tpl_compiler: {
	options: {
		ext: '-tpl',
		replaceEscapeMap: {
			'\xB0': '&deg;'
		}
	},
	main: {
		files: [
			{
				expand: true,
				cwd: 'src/',
				src: ['**/*.tpl.html'],
				dest: 'src/'
			}
		]
	}
  },
});
```

#### 词汇

- HTML 模板文件
	- 一个普通的 HTML 文件，其中以 [juicer](http://juicer.name) 语法书写要用到的模板文件，模板文件通过 DOM 节点的 `data-tpl` 属性指定各个模板的钩子。
- JavaScript 模板文件
	- 从 HTML 模板文件生成的对应的 JavaScript 文件，该文件为一个普通的 KISSY 模块，对 HTML 模板文件中的各个模板进行抽离，对外暴露 `get`、`set`、`register`、`render` 方法以读写模板字符串。
	- 一个 HTML 模板文件对应生成一个 JavaScript 模板文件。

#### 使用方法

1. 在 "src" 目录下的指定 HTML 模板文件中编辑，根据 grunt config 中的 `main->files->src` 指定，如上面的 `**/*.tpl.html` 即为 `.tpl.html` 后缀的 html 文件视为需要处理的 HTML 模板文件，示例：

	[src/pages/index.tpl.html]

	``` html
	
		...
		<body>
    		<div class="page">

        		<div id="J_Test" data-tpl="ProdList">
            		<h2>${title}</h2>
            		<ul class="prod-list">
                		{@each prods as prod}
                		<li class="prod-item">${prod.name} - ${prod.price}</li>
                	{@/each}
            	</ul>
        	</div>

        	<div class="test2">
            	<section data-tpl="MoreList">
                	<dl>
                    	{@each moreList as item}
                    	<dt>${item.title}</dt>
                    	<dd>${item.desc}</dd>
                    	{@/each}
                	</dl>
            	</section>
        	</div>

    	</div>
	</body>
	
	```
	
	其中指定了两个模板：`<div id="J_Test" data-tpl="ProdList">...</div>` 和 `<section data-tpl="MoreList"></section>`。

2. 执行 `grunt tpl_compiler`，生成对应的 JavaScript 模板文件：

	[src/pages/index-tpl.js]
	
	``` javascript
		/**
 	 	 * KISSY Template Module for test
 	 	 */
		KISSY.add(function (S, Juicer) {
    		'use strict';
    		/**
    	 	 * 维护所有用到的模板
    	 	 * @class Template
    	 	 * @constructor
    	 	 */
     		var templates = {
            	ProdList: '<div id="J_Test" data-tpl="ProdList"><h2>${title}</h2><ul class="prod-list">{@each prods as prod}<li class="prod-item">${prod.name} - ${prod.price}</li> {@/each} </ul></div>',
            	MoreList: '<section data-tpl="MoreList"><dl>{@each moreList as item}<dt>${item.title}</dt><dd>${item.desc}</dd> {@/each} </dl></section>'
        	};
    		return {
        		/**
         	 	 * 注册模板自定义函数
         	 	 * @param name 需要替换的模板中用到的名字
         	 	 * @param fn 自定义函数
         	 	 */
        		register: function (name, fn) {
            		Juicer.register(name, fn);
        		},
        		/**
         	 	 * 覆盖已有模板
         	 	 * @param key {String} template 模板键
         	 	 * @param tmpl {String} 模板
         	 	 */
        		set: function (key, tmpl) {
            		templates[key] = tmpl;
        		},
        		/**
         	 	 * 获取已有模板
         	 	 * @param key {String} 模板Key
         	 	 * @returns {String} 模板内容
         	 	 */
        		get: function (key) {
            		return templates[key];
        		},
        		/**
         	 	 * 根据指定的模板key和数据渲染生成html
         	 	 * @param key 模板的key
         	 	 * @param data json数据
         	 	 * @returns {String}
         	 	 */
        		render: function (key, data) {
            		return Juicer(templates[key], data);
        		}
    		};
		}, { requires: ['gallery/juicer/1.3/index'] });
	```

3. 这样其他模块中需要依赖模板的地方，直接通过 KISSY 模块 `require` 该 JavaScript 模板文件即可，通用的 `register` 方法也可以写在该 JavaScript 模板文件中。 

4. 修改 `src/pages/index.tpl.html`，重新构建后生成的 `src/pages/index-tpl.js` 中 **只会覆盖 `var templates = {...}` 部分**。因此如果直接修改 `src/pages/index-tpl.js` 中除 `var templates = {...}` 的部分，重新构建时修改内容 **会保留而不会被覆盖掉**。

5. 建议将该任务加入到 `watch` 中实时编译模板文件，保证本地服务实时取的是最新的模块。


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

- [0.1.3] Bugfix for html escape
- [0.1.0] 基本功能完成
