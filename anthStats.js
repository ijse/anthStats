
;(function(name, definition) {

	// Bind exports in different environments
	if (typeof define === 'function') {
		// AMD or CMD module system
		define(definition);
	} else if (typeof module !== 'undefined' && module.exports) {
		// Maybe this is a node module
		var http = require('http');
		module.exports = definition(http);
	} else {
		// in browser or others
		window[name] = definition();
	}

})('anthStats', function(Http) {
	"use strict";

	var _loadTimestamp = new Date();

	// Serialize array to query string with encodeURI
	var _serilizeData = function(arr) {
		var result = [];
		for(var i=0, l=arr.length; i<l; i++) {
			var item = arr[i];
			var key = encodeURIComponent(item[0]);
			var value = encodeURIComponent(item[1]);
			result.push( key + "=" + value);
		}
		return result.join('&');
	};

	var _deepCopyObject = function(obj) {
		var result = {};
		var objKeys = Object.keys(obj);
		for(var i=0, l=objKeys.length; i<l; i++) {
			var item = objKeys[i];
			result[item] = obj[item];
		}
		return result;
	}

	// Send http request method
	var _sendJSONP = function(url, success) {
		var ts = (new Date()).getTime();
		var img = new Image();
		img.src = url + "&ts=" + ts;

		// Not care 404
		img.onload = img.onerror = function() {
			success();
			img.onload = img.onerror = null;
		};
	};

	var _sendHTTP = function(url, callback) {
		// Node env
		Http.get(url, callback).on('error', callback);
	};

	var _send = function(reportUrl, params, defaultParamsStr, cb) {
		// Convert object to arr
		var paramsArr = [];
		var paramsKeys = Object.keys(params);
		for(var i=0, l=paramsKeys.length; i<l; i++) {
			var key = paramsKeys[i];
			paramsArr.push([ key, params[key]]);
		}
		// Compile data, convert array to query string
		var paramsStr = _serilizeData(paramsArr)

		// Concat with url
		reportUrl += "?" + defaultParamsStr + "&" + paramsStr;

		// send request
		if(Http) {
			_sendHTTP(reportUrl, callback);
		} else {
			_sendJSONP(reportUrl, callback);
		}

		function callback() {
			// success
			cb(reportUrl);
		}

		return reportUrl;
	};

	// Create instance
	var anthStats = function anthStatsF(options) {
		this.options = {
			// default settings
		};

		options && typeof options == 'object' && this.setOptions(options);
		this.defaultValue = "";
		this.statsEvents = {};
	};

	// Process options
	anthStats.prototype.setOptions = function setOptionsF(options){
        // shallow copy
        var o = this.options;
        var key;

        for (key in options)
        	options.hasOwnProperty(key) && (o[key] = options[key]);

        return this;
    };

	// Set default value that send with every request
	// param - Array [ [ item, default_value, ...], ...]
	anthStats.prototype.setDefault = function setDefaultF(param) {
		this.defaultValue = _serilizeData(param);
		return this.defaultValue;
	};

	// Define stats types
	anthStats.prototype.defineEvent = function defineEventF(typeName, configs) {
		if(!configs.url) throw new Error('Need the request url.');
		if(!configs.schema) configs.schema = [];

		this.statsEvents[typeName] = configs;
		return this.statsEvents;
	};

	anthStats.prototype.push = function(args, callback) {
		var reportUrl = '';
		var eventName = args[0];
		var eventConfig = this.statsEvents[eventName];

		if(!eventConfig) throw new Error('Undefined event ' + eventName + '.');

		// Apply data, merge with defaults
		var params = _deepCopyObject(eventConfig.defaults);
		for(var i=0, l=eventConfig.schema.length; i<l; i++) {
			var key = eventConfig.schema[i];
			var val = args[i+1];
			if(typeof val !== 'undefined') {
				params[key] = val;
			}
		}

		_send(eventConfig.url, params, this.defaultValue, callback);
	};

	return anthStats;
})

