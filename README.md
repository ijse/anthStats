# anthStats

[![Build Status](https://secure.travis-ci.org/ijse/anthStats.png?branch=master)](http://travis-ci.org/user/anthStats)


## Installation

Install with npm:

```
npm install --save anthStats
```

## API

### anthStats.setDefault()
```
var result = __stats.setDefault([
	['userId', 9527],
	['serial', 'xxx']
]);
```
### anthStats.defineEvent()
```
var pageVisitConfigs = {
	url: "http://baidu.com/url",
	defaults: { count: 0, from: 'web' },
	schema: [ 'count', 'action' ]
};
var result = __stats.defineEvent('page_visit', pageVisitConfigs);
```
### anthStats.push()
```
__stats.push(['page_visit', 1]);
```

## Testing

From the repo root:

```
npm install
npm test
```
