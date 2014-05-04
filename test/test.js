
if(!Should) {
	var Should = require('should');
}

describe('anthStats', function () {

	var anthStats;
	before(function() {
		if(typeof window === 'undefined') {
			anthStats = require('../');
			sinon = require('sinon');
		} else {
			anthStats = window.anthStats;
		}
	});

	describe('#setOptions()', function() {
		var __stats;
		before(function() {
			__stats = new anthStats();
		});
		it('return the query string of default values.', function () {
			var result = __stats.setOptions({
				defaults: {
					userId: 9527,
					serial: 'xxx'
				}
			});

			result.defaultsValue.should.be.eql('userId=9527&serial=xxx');
		});
	});

	describe('#defineEvent()', function() {
		var __stats;
		beforeEach(function() {
			__stats = new anthStats();
		});
		it('add page_visit event.', function() {
			var pageVisitConfigs = {
				url: "http://www.baidu.com/url",
				defaults: { count: 0, from: 'web' },
				schema: [ 'count', 'action' ]
			};
			var result = __stats.defineEvent('page_visit', pageVisitConfigs);

			result.should.have.property('page_visit');
		});
		it('add page_visit event without url', function() {
			var pageVisitConfigs = {
				defaults: { count: 0, from: 'web' },
				schema: [ 'count', 'action' ]
			};
			(function(){
				__stats.defineEvent('page_visit', pageVisitConfigs);
			}).should.throw();
			// result.should.throw();
		});
		it('add page_visit event without schema', function() {
			var pageVisitConfigs = {
				url: "http://www.baidu.com/url",
				defaults: { count: 0, from: 'web' }
			};
			__stats.defineEvent('page_visit', pageVisitConfigs);

		});
	});

	describe('#push()', function() {
		var __stats;
		beforeEach(function() {
			__stats = new anthStats({ debug: true });
			__stats.defineEvent('page_visit', {
				url: "http://www.baidu.com/url",
				defaults: { count: 0, from: 'web' },
				schema: [ 'count', 'action' ]
			});
		});

		it('send with full params.', function(done) {
			var task = 0;
			__stats.push(['page_visit', 1, 'click'], function(result) {

				result.should.be.eql('http://www.baidu.com/url?count=1&from=web&action=click');
				task.should.be.equal(1);
				done();
			});
			task ++;
		});

		it('send with partial params.', function(done) {
			var task = 0;
			__stats.push(['page_visit', 1 ], function(result) {

				result.should.be.eql('http://www.baidu.com/url?count=1&from=web');
				task.should.be.equal(1);
				done();
			});
			task ++;
		});

		it('use default value if it is not provided.', function(done) {
			var task = 0;
			__stats.push(['page_visit'], function(result) {

				result.should.be.eql('http://www.baidu.com/url?count=0&from=web');
				task.should.be.equal(1);
				done();
			});
			task ++;
		});

		it('throw error if undefined event.', function() {
			(function() {
				__stats.push(['undefined_event', 1]);
			}).should.throw();
		});

		it('With debounce enabled, only send event twice', function(done) {
			__stats.defineEvent('test_debounce', {
				url: "http://www.baidu.com/url",
				defaults: { name: 'ijse' },
				schema: [ 'name' ],
				debounce: 15
			});

			var callback = sinon.spy();
			setTimeout(function() {
				__stats.push(['test_debounce', 'xx1'], callback);
			}, 5);
			setTimeout(function() {
				__stats.push(['test_debounce', 'xx2'], callback);
			}, 20);
			__stats.push(['test_debounce', 'xx3'], callback);
			setTimeout(function() {
				__stats.push(['test_debounce', 'xx4'], callback);
			}, 50);

			setTimeout(function() {
				callback.calledTwice.should.be.true;
				done();
			}, 600);
		});

		it('With throttle enabled, wait 500ms before the last event.', function(done) {
			__stats.defineEvent('test_throttle', {
				url: "http://www.baidu.com/url",
				defaults: { name: 'aaa' },
				schema: [ 'name' ],
				throttle: 500
			});

			var stub;
			var callback = function() {
				if(stub) {
					// Assert with ±100ms
					(new Date() - stub).should.be.approximately(500, 100);
					done();
				} else {
					stub = new Date();
				}
			};
			__stats.push(['test_throttle', 'xxx'], callback);
			__stats.push(['test_throttle', 'xdx'], callback);
		});

	});


});
