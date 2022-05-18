# mongo-express-req [![Build Status](https://travis-ci.org/floatdrop/mongo-express-req.svg?branch=master)](https://travis-ci.org/floatdrop/mongo-express-req)

> Get db connection in request


## Install

```
$ npm install --save mongo-express-req
```


## Usage

```js
var app = require('express')();

var expressMongoDb = require('mongo-express-req');
app.use(expressMongoDb('mongodb://localhost/test'));

app.get('/', function (req, res, next) {
	req.db // => Db object
});
```


## API

### expressMongoDb(uri, [options])

#### uri

*Required*  
Type: `string`

[Connection string uri](http://docs.mongodb.org/manual/reference/connection-string/).

#### options

All options from [MongoClient](http://mongodb.github.io/node-mongodb-native/2.0/api/MongoClient.html) are accepted as well.

##### property

Type: `String`  
Default: `db`

Property on `request` object in which db connection will be stored.


## License

MIT © [Vsevolod Strukchinsky](http://github.com/floatdrop) and [Dev Singh](http://github.com/devksingh4)
