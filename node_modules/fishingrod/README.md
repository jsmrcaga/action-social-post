# fishingrod

A simple module for making http requests, depends on `nothing` but `http` and `https`.

`NOTE:` this is not intended to be a full-featured http package, or a full-tested module. This is a simple,
working http module, that permits very simple requests. `Do not use in production without testing`.


## Simple Example

```javascript
const fishingrod = require('fishingrod');

fishingrod.fish({
	https:true,
	host: 'example.com',
	path: '/obj/1'
},
function(err, st, res){
	console.log(res);
});

fishingrod.fish({
	https:true,
	host: 'example.com',
	path: '/obj/2'
}).then(function(res){
	console.log(res.response);
});


``` 

## API

`fishingrod` works in a very simple way using different parameters. A simple request will typically use `https`, `host`, `path`, `method` and `data` & `headers` if needed.

Some more parameters are also available if you would ever need them, and direct url pasting (`request` style) is also applicable.

| Parameter | Type | Description | 
|:---------:|:----:|:------------|
| `https`| Boolean | Sets `https:` or `http:` as the protocol|
| `method` | String | Sets the method for the request. All usual HTTP methods are accepted (`GET`, `POST`, `PUT`, `DELETE` ...). MUST BE uppercase |
| `host` | String | The host for the request. Ex: `api.google.com` |
| `path` | String | The path for the request. Ex `/api/v3.0/something?this=is&a=query` (Query is optional, but for `POST` requests it won't be extracted from `data`)|
| `data` | String or Object | The data to send to the server. If the data is an object, it will be `JSON.stringify`ed for you. | 
| `headers`| Object | A collection of headers for the request. Ex: `{'Content-Type':'application/json', 'X-My-Header': 'something custom'}` |
| `parse` | Boolean | If the response contains header `Content-Type: application/json` it will be `JSON.parse`d before giving you control of the answer|
| `redir` | Boolean | If the response is a 3xx Http code and contains `Location:` header, will automatically redirect before giving you control |
| `encoding` | String | Sets the encoding for the response. Default is `'utf8'` |
| `debug` | Boolean| Sets the debug option, logging errors and every request |
| `join` | Char | If using Object Data && `Content-Type: application/x-www-form-urlencoded`, will be used as the join char between key-value pairs. Ex: `plep=56${join}plop=57` |
| `separator` | Char | If using Object Data && `Content-Type: application/x-www-form-urlencoded`, will be used as the join char between each key and its value. Ex: `plop${separator}56` |

## Utility methods

You can also call `fishingrod` with only a url using the utility methods. These are `.get`, `.post`, `.put`, `.delete`, `._method`.
They all take `(url [STRING], data[OBJECT], headers[OBJECT])` as params, except `_method` which takes `(method, [STRING CAPITALS], url [STRING], data[OBJECT], headers[OBJECT])`.

```javascript
const fishingrod = require('fishingrod');

fishingrod.get('http://google.com', {query:'Bottomatik chatbots'}, {'Accept':'application/pdf'});
```