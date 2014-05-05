var http = require('http');
var ecstatic = require('ecstatic');
var fs = require('fs');

var st = ecstatic(__dirname + '/static');
var server = http.createServer(function (req, res) {
	if(req.url === '/lib/anthStats.js') {
		res.setHeader("Content-Type", "application/x-javascript")
		fs.createReadStream(__dirname + '/../lib/anthStats.js').pipe(res);
		return;
	}

	if(/^\/stat/.test(req.url)) {
		console.log("Got stat: ", req.url);

		res.setHeader("Content-Type", "image/jpeg")
		res.end();
		return;
	}

	st(req, res);
});
server.listen(8000);

console.log('Listening for request:');
