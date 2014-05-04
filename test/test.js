
if(!Should) {
	var Should = require('should');
}

describe('anthStats', function () {

	var anthStats;
	before(function() {
		if(typeof window === 'undefined') {
			anthStats = require('../anthStats.js');
		} else {
			anthStats = window.anthStats;
		}
	});

	describe('#setDefault()', function() {
		var __stats;
		before(function() {
			__stats = new anthStats();
		})
		it('return the query string of default values.', function () {
			var result = __stats.setDefault([
				['userId', 9527],
				['serial', 'xxx']
			]);

			result.should.be.eql('userId=9527&serial=xxx');
		});
	});

	describe('#defineEvent()', function() {
		var __stats;
		beforeEach(function() {
			__stats = new anthStats();
			__stats.setDefault([
				['userId', 9527],
				['serial', 'xxx']
			]);
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
		before(function() {
			__stats = new anthStats();
			__stats.setDefault([
				['userId', 9527],
				['serial', 'xxx']
			]);
			__stats.defineEvent('page_visit', {
				url: "http://www.baidu.com/url",
				defaults: { count: 0, from: 'web' },
				schema: [ 'count', 'action' ]
			});
		});

		it('send with full params.', function(done) {
			var task = 0;
			__stats.push(['page_visit', 1, 'click'], function(result) {

				result.should.be.eql('http://www.baidu.com/url?userId=9527&serial=xxx&count=1&from=web&action=click');
				task.should.be.equal(1);
				done();
			});
			task ++;
		});

		it('send with partial params.', function(done) {
			var task = 0;
			__stats.push(['page_visit', 1 ], function(result) {

				result.should.be.eql('http://www.baidu.com/url?userId=9527&serial=xxx&count=1&from=web');
				task.should.be.equal(1);
				done();
			});
			task ++;
		});

		it('use default value if it is not .', function(done) {
			var task = 0;
			__stats.push(['page_visit'], function(result) {

				result.should.be.eql('http://www.baidu.com/url?userId=9527&serial=xxx&count=0&from=web');
				task.should.be.equal(1);
				done();
			});
			task ++;
		});

		it('throw error if undefined event.', function() {
			(function() {
				__stats.push(['undefined_event', 1]);
			}).should.throw();
		})

	});


});
