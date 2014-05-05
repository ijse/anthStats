var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
	if(req.url === '/lib/anthStats.js') {
		res.setHeader("Content-Type", "application/x-javascript");
		fs.createReadStream(__dirname + '/../lib/anthStats.js').pipe(res);
		return;
	}

	if(/^\/stat/.test(req.url)) {
		console.log("Got stat: ", req.url);

		res.setHeader("Content-Type", "image/jpeg");
		res.end();
		return;
	}

	if(/^\/(index.html)?/.test(req.url)) {
		res.setHeader("Content-Type", "text/html");
		fs.createReadStream(__dirname + '/static/index.html').pipe(res);
		return;
	}

});
server.listen(8000);

console.log('Listening for request:');
