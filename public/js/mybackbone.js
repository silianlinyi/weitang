
(function() {
	
	debugger
	var root = this;

	var previousBackbone = root.Backbone;

	var array = [];
	var push = array.push;
	var slice = array.slice;
	var splice = array.splice;

	var Backbone;
	if(typeof exports !== 'undefined') {
		Backbone = exports;
	} else {
		Backbone = root.Backbone = {};
	}

	Backbone.VERSION = '1.1.0';

	var _ = root._;
	if(!_ && (typeof require !== 'undefined')) {
		_ = require('underscore');
	}

	Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$;

	Backbone.noConflict = function() {
		root.Backbone = previousBackbone;
		return this;
	}

	Backbone.emulateHTTP = false;

	Backbone.emulateJSON = false;

	// Backbone.Events
	// ---------------
	var Events = Backbone.Events = {

		on: function(name, callback, context) {

		},

		once: function(name, callback, context) {

		},

		off: function(name, callback, context) {

		},

		trigger: function(name) {

		},

		stopListening: function(obj, name, callback) {

		}

	};












	var Model = Backbone.Model = function(attributes, options) {

	};


	var Collection = Backbone.COllection = function(models, options) {

	};


	var View = Backbone.View = function(options) {

	};


	Backbone.sync = function(method, model, options) {

	};


	Backbone.ajax = function() {

	};


	var Router = Backbone.Router = function(options) {

	};


	var History = Backbone.History = function() {

	};








}).call(this);