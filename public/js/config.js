/**
 * 给Sea.js用的项目配置文件
 */
seajs.config({
	plugins: ['shim'],
	alias: {
		'jquery': {
			src: '/lib/jquery.js',
			exports: 'jQuery'
		},

		'underscore': {
			src: '/lib/underscore.js',
			exports: '_'
		},

		'backbone': {
			src: '/lib/backbone.js',
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},

		'backbone.localStorage': {
			src: '/lib/backbone-localstorage.js',
			deps: ['backbone']
		},

		'json2': {
			src: '/lib/json2.js',
			exports: 'json2'
		}
	}
})