let urlparser = {};
const URL = require('url');
const QS = require('querystring');

urlparser.parse = function(url){
	let params = URL.parse(url);
	if(params.query){
		params.data = QS.parse(params.query); 
		params.path = params.pathname;
	}
	if(params.protocol){
		if(params.protocol === 'http:'){
			params.https = false;
		} else if (params.protocol === 'https:'){
			params.https = true;
		}
	} else {
		params.https = false;
	}
	return params;
};

urlparser.request = function(request, method, url, headers, data){
	let params = urlparser.parse(url);
	if(data){
		data = request.handle(data, {});
		params.data = data;
	}
	if(headers){
		headers = request.headers(method, headers, data);
		params.headers = headers;
	}
	return params;
};

urlparser.redir = function(request, url, params, data, callback){
	url = urlparser.parse(url);
	params.host = url.host;
	params.path = url.path;
	if(url.data){
		params.path += `?${QS.stringify(params.data)}`;
	}
	return request(params, data, callback);
};


module.exports = urlparser;