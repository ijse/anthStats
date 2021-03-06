# anthStats

[![Build Status](https://secure.travis-ci.org/ijse/anthStats.png?branch=master)](http://travis-ci.org/ijse/anthStats)

## Features

* Support browser and Node.js
* Url encoded before sending
* Configurable default data for global and certain event
* Auto appending timestamp for requests from browser
* Debounce and throttle limits
* *Buffer requests

## Installation

Install with npm:

```
npm install --save anthStats
```

Insert in html:

```
<html>
	<head>
		...
		<script src="anthStats.js"></script>
		...
	</head>
	...
</html>
```

## anthStats API

```
var __stats = new anthStats({
	debug: false,
	defaults: {
		serial: 'xxx'
	}
});
```

### anthStats#defineEvent()
```
var pageVisitConfigs = {
	url: "http://baidu.com/url",
	defaults: { count: 0, from: 'web' },
	schema: [ 'count', 'action' ],
	throttle: 500
	// debounce: 15
};
var result = __stats.defineEvent('page_visit', pageVisitConfigs);
```
### anthStats#push()
```
__stats.push(['page_visit', 1], callback);
```

## Example

```
npm start
```
and open url `http://localhost:8000`.

## Testing

From the repo root:

```
npm install
npm test
```
