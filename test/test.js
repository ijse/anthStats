
if(!Should) {
	var Should = require('should');
}

describe('anthStats', function () {

	var __stats = null;
	before(function() {
		if(typeof window === 'undefined') {
			__stats = require('../anthStats.js');
		} else {
			__stats = window.__stats;
		}
	});

	it('#setDefault()', function () {
		var result = __stats.setDefault([
			['userId', 9527],
			['serial', 'xxx']
		]);

		result.should.be.eql('userId=9527&serial=xxx');
	});

	it('#defineEvent()', function() {

		var pageVisitConfigs = {
			url: "http://baidu.com/url",
			defaults: { count: 0, from: 'web' },
			schema: [ 'count', 'action' ]
		};
		var result = __stats.defineEvent('page_visit', pageVisitConfigs);

		result.should.have.property('page_visit');
		// result['page_visit'].should.be.eql(pageVisitStruct);
	});

	it('#push()', function(done) {
		var task = 0;
		__stats.push(['page_visit', 1], function(result) {

			result.should.be.eql('http://baidu.com/url?userId=9527&serial=xxx&count=1&from=web');
			task.should.be.equal(1);
			done();
		});
		task ++;

	});

});
