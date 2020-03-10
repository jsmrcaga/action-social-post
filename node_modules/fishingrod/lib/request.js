const qs = require('querystring');
const urlparser = require('./urlparser');

let req = function(options, data, callback){
	let write_data = data ? true : false;
	let http = options.https ? require('https') : require('http');

	if(['GET', 'DELETE', 'PATCH'].indexOf(options.method) > -1 && data){
		options.path += '?' + data;
		write_data = false;
	}

	let func = function(resolve, reject){
		let request = http.request(options, function(res){
			let response = '';
			let buffer = [];
			
			res.on('data', function (chunk){
				buffer.push(chunk);
				response += chunk;
			});

			res.on('end', function(){
				res.setEncoding(options.encoding || 'utf8');
				if(res.headers['content-type'] && res.headers['content-type'] === 'application/json' && options.parse){
					try{
						response = JSON.parse(response); 
					} catch(e) {}
				}

				if(res.statusCode >= 300 && res.statusCode < 400){
					if(res.headers['location'] && (options.redir || options['3xx'])){						
						// redirect and execute initial resolve + callback
						return urlparser.redir(req, res.headers['location'], options, data, callback).then(res => {
							resolve(res);
						}).catch(e => {
							reject(e);
						});
					}
				}

				// execute callback in async mode
				if(callback){
					process.nextTick(callback, null, {
						status: res.statusCode,
						headers: res.headers,
						http: res
					}, response, Buffer.concat(buffer));	
				}

				if(resolve){
					resolve({
						status: res.statusCode,
						headers: res.headers,
						http: res,
						response: response,
						raw: Buffer.concat(buffer)
					});
				}

			});
		});

		request.on('error', function(e){
			if(options.debug){
				console.log('[FISHINGROD] ', Date.now(), 'Error on request', JSON.stringify(options));
			}

			if(callback){
				process.nextTick(()=>{
					callback(new Error(e), null, null);
				});
			}
			if(reject){
				process.nextTick(()=>{
					reject(e);
				});
			}
		});

		if(options.debug){
			console.log('[FISHINGROD] ', Date.now(), 'Sending request as', JSON.stringify(options));
		}

		if((typeof data !='undefined') && data!=null && write_data){
			request.write(data);
			request.end();
		}else{
			request.end();
		}
	};

	return new Promise(func);	
};

// handles data manipulation
req.handle = function(data, params){
	if(!params) { params = {}; }
	if(!data.data){ return null; }
	if(typeof data.data === 'string'){
		return data.data;
	} else if (data.data instanceof Array){
		return data.data.join(params.join || ';');
	}

	if(!data.method){ data.method = 'GET'; }
	if(!data.headers){ data.headers = {}; }

	if(['GET', 'DELETE', 'PATCH'].indexOf(data.method) > -1){
		return qs.stringify(data.data, params.join, params.separator);
	}

	if(data.headers && data.headers['Content-Type']){
		let h = data.headers['Content-Type'];
		if((/application\/json/).test(h)){
			return JSON.stringify(data.data);
		} else if ((/application\/x-www-form-urlencoded/).test(h)) {
			return qs.stringify(data.data, params.join, params.separator);
		} else {
			return (Buffer.from(JSON.stringify(data.data))).toString(params.encoding || 'utf8');
		}
	} else {
		return (Buffer.from(JSON.stringify(data.data))).toString(params.encoding || 'utf8');
	}
};

req.headers = function(method, params, data){
	let headers = params || {};
	if(data && ['GET', 'DELETE', 'PATCH'].indexOf(method) === -1){
		let length = Buffer.byteLength(data);
		if(!headers['Content-Length'] || headers['Content-Length'] !== length){
			headers['Content-Length'] = length;
		}

		if(!headers['Content-Type']){
			headers['Content-Type'] = 'text/plain';	
		}
	}

	if(params){
		for(let h in headers){
			if(!params[h]){
				params[h] = headers[h];
			}
		}
	} else {
		params = headers;
	}

	return params;
};
module.exports = req;