/**
 * KISSY Template Module for 123
 */
KISSY.add(function (S, Juicer) {
    'use strict';
    /**
    * 维护所有用到的模板
    * @class Template
    * @constructor
    */
    var templates = {
            ProdList: ' <h2>${title}</h2> <ul class="prod-list"> {@each prods as prod} <li class="prod-item">${prod.name} - ${prod.price}</li> {@/each} </ul> ',
            MoreList: ' <dl data-spmClick="abc"> {@each moreList as item} <dt>${item.title}</dt> <dd>${item.desc}</dd> {@/each} </dl> '
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