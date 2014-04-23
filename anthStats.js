
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
		this[name] = definition();
	}

})('__stats', function(Http) {
	"use strict";

	var _exports = {};

	var _defaultValue = '';
	var _statsEvents = {};

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
	var _sendJSONP = function(url, success, error) {
		// Create script element to send jsonp(GET) request
		var tag = document.createElement('script');
		tag.src = url;
		tag.onload = tag.onreadystatechange = function() {
			if(!this.readyState || this.readyState=='loaded' || this.readyState=='complete') {
				// Request sended
				success();

				// todo: remove tag
			}
		}
	};

	var _sendHTTP = function(url, callback) {
		// Node env
		Http.get(url, callback).on('error', callback);
	};

	var _send = function(reportUrl, params, cb) {
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
		reportUrl += "?" + _defaultValue + "&" + paramsStr;

		// todo: send request
		if(Http) {
			_sendHTTP(reportUrl, callback, callback);
		} else {
			_sendJSONP(reportUrl, callback);
		}

		function callback() {
			// success
			cb(reportUrl);
		}

		return reportUrl;
	};

	// Set default value that send with every request
	// param - Array [ [ item, default_value, ...], ...]
	var _setDefault = function(param) {
		_defaultValue = _serilizeData(param);

		return _defaultValue;
	};

	// Define stats types
	var _defineEvent = function(typeName, configs) {
		_statsEvents[typeName] = configs;
		return _statsEvents;
	};

	var _push = function(args, callback) {
		var reportUrl = '';
		var eventName = args[0];
		var eventConfig = _statsEvents[eventName];

		// Apply data, merge with defaults
		var params = _deepCopyObject(eventConfig.defaults);
		for(var i=0, l=eventConfig.schema.length; i<l; i++) {
			var key = eventConfig.schema[i];
			var val = args[i+1];
			if(typeof val !== 'undefined') {
				params[key] = val;
			}
		}

		setTimeout(function() {
			_send(eventConfig.url, params, callback);
		} , 0);
	};

	_exports.setDefault = _setDefault;
	_exports.defineEvent = _defineEvent;
	_exports.push = _push;

	return _exports;
})

