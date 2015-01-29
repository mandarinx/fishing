(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

if (document.readyState === 'complete' ||
    document.readyState === 'interactive') {
    window.setTimeout(_boot, 0);
} else {
    document.addEventListener('DOMContentLoaded', _boot, false);
    window.addEventListener('load', _boot, false);
}

function _boot() {
    if (!document.body) {
        window.setTimeout(_boot, 20);
    } else {
        document.removeEventListener('DOMContentLoaded', _boot);
        window.removeEventListener('load', _boot);

        window.log = console.log.bind(console);

        var extensions = require('./utils/extensions.js');
        var fishing = require('./fishing.js');
        fishing();
    }
};

},{"./fishing.js":8,"./utils/extensions.js":24}],2:[function(require,module,exports){
// PERLIN NOISE
// based 99.999% on Processing's implementation, found here:
// https://github.com/processing/processing/blob/master/core/src/processing/core/PApplet.java
// credit goes entirely to them. i just ported it to javascript.

var Alea = require("alea"); // this is pretty great, btw

var Perlin = module.exports = function(seed) {
	if (seed != undefined) {
		this.alea_rand = new Alea(seed); // use provided seed
	} else {
		this.alea_rand = new Alea(); // use random seed
	}
	this.PERLIN_YWRAPB = 4;
	this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
	this.PERLIN_ZWRAPB = 8;
	this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
	this.PERLIN_SIZE = 4095;
	this.perlin_octaves = 4; // default to medium smooth
	this.perlin_amp_falloff = 0.5; // 50% reduction/octave
	this.perlin_array = new Array();
	// generate cos lookup table
	var DEG_TO_RAD = 0.0174532925;
	var SINCOS_PRECISION = 0.5;
	var SINCOS_LENGTH = Math.floor(360/SINCOS_PRECISION);
	this.cosLUT = new Array();
	for (var i = 0; i < SINCOS_LENGTH; i++) {
		this.cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
	}
	this.perlin_TWOPI = SINCOS_LENGTH;
	this.perlin_PI = SINCOS_LENGTH;
	this.perlin_PI >>= 1;
}

Perlin.prototype.noiseReseed = function() {
	this.alea_rand = new Alea(); // new random seed
	this.perlin_array = new Array(); // start the perlin array fresh
}

Perlin.prototype.noiseSeed = function(seed) {
	this.alea_rand = new Alea(seed); // use provided seed
	this.perlin_array = new Array(); // start the perlin array fresh
}


Perlin.prototype.noiseDetail = function(lod, falloff) {
	if (Math.floor(lod) > 0) this.perlin_octaves = Math.floor(lod);
	if (falloff != undefined && falloff > 0) this.perlin_amp_falloff = falloff;
}

Perlin.prototype.noise_fsc = function(i) {
	return 0.5 * (1.0 - this.cosLUT[Math.floor(i * this.perlin_PI) % this.perlin_TWOPI]);
}

Perlin.prototype.noise = function(x, y, z) {
	if (x == undefined) {
		return false; // we need at least one param
	}
	if (y == undefined) {
		y = 0; // use 0 if not provided
	}
	if (z == undefined) {
		z = 0; // use 0 if not provided
	}
	
	// build the first perlin array if there isn't one
	if (this.perlin_array.length == 0) {
		this.perlin_array = new Array();
		for (var i = 0; i < this.PERLIN_SIZE + 1; i++) {
			this.perlin_array[i] = this.alea_rand();
		}
	}

	if (x < 0) x = -x;
	if (y < 0) y = -y;
	if (z < 0) z = -z;
	var xi = Math.floor(x);
	var yi = Math.floor(y);
	var zi = Math.floor(z);
	var xf = x - xi;
	var yf = y - yi;
	var zf = z - zi;
	var r = 0;
	var ampl = 0.5;
	var rxf, ryf, n1, n2, n3;
	
	for (var i = 0; i < this.perlin_octaves; i++) {
		// look at all this math stuff
		var of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);
		rxf = this.noise_fsc(xf);
		ryf = this.noise_fsc(yf);
		n1  = this.perlin_array[of & this.PERLIN_SIZE];
		n1 += rxf * (this.perlin_array[(of + 1) & this.PERLIN_SIZE] - n1);
		n2  = this.perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
		n2 += rxf * (this.perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
		n1 += ryf * (n2-n1);
		of += this.PERLIN_ZWRAP;
		n2  = this.perlin_array[of & this.PERLIN_SIZE];
		n2 += rxf * (this.perlin_array[(of + 1) & this.PERLIN_SIZE] - n2);
		n3  = this.perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
		n3 += rxf * (this.perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
		n2 += ryf * (n3 - n2);
		n1 += this.noise_fsc(zf) * (n2 - n1);
		r += n1 * ampl;
		ampl *= this.perlin_amp_falloff;
		xi <<= 1;
		xf *= 2;
		yi <<= 1;
		yf *= 2;
		zi <<= 1; 
		zf *= 2;
		if (xf >= 1) { xi++; xf--; }
		if (yf >= 1) { yi++; yf--; }
		if (zf >= 1) { zi++; zf--; }
	}
	return r;
}

},{"alea":3}],3:[function(require,module,exports){
(function (root, factory) {
  if (typeof exports === 'object') {
      module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
      define(factory);
  } else {
      root.Alea = factory();
  }
}(this, function () {

  'use strict';

  // From http://baagoe.com/en/RandomMusings/javascript/

  // importState to sync generator states
  Alea.importState = function(i){
    var random = new Alea();
    random.importState(i);
    return random;
  };

  return Alea;

  function Alea() {
    return (function(args) {
      // Johannes Baagøe <baagoe@baagoe.com>, 2010
      var s0 = 0;
      var s1 = 0;
      var s2 = 0;
      var c = 1;

      if (args.length == 0) {
        args = [+new Date];
      }
      var mash = Mash();
      s0 = mash(' ');
      s1 = mash(' ');
      s2 = mash(' ');

      for (var i = 0; i < args.length; i++) {
        s0 -= mash(args[i]);
        if (s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(args[i]);
        if (s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(args[i]);
        if (s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;

      var random = function() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
      random.uint32 = function() {
        return random() * 0x100000000; // 2^32
      };
      random.fract53 = function() {
        return random() + 
          (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
      };
      random.version = 'Alea 0.9';
      random.args = args;

      // my own additions to sync state between two generators
      random.exportState = function(){
        return [s0, s1, s2, c];
      };
      random.importState = function(i){
        s0 = +i[0] || 0;
        s1 = +i[1] || 0;
        s2 = +i[2] || 0;
        c = +i[3] || 0;
      };
 
      return random;

    } (Array.prototype.slice.call(arguments)));
  }

  function Mash() {
    var n = 0xefc8249d;

    var mash = function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
  }
}));

},{}],4:[function(require,module,exports){
/*! qwest 1.5.4 (https://github.com/pyrsmk/qwest) */

;(function(context,name,definition){
	if(typeof module!='undefined' && module.exports){
		module.exports=definition;
	}
	else if(typeof define=='function' && define.amd){
		define(definition);
	}
	else{
		context[name]=definition;
	}
}(this,'qwest',function(){

	var win=window,
		doc=document,
		before,
		// Default response type for XDR in auto mode
		defaultXdrResponseType='json',
		// Variables for limit mechanism
		limit=null,
		requests=0,
		request_stack=[],
		// Get XMLHttpRequest object
		getXHR=function(){
				return win.XMLHttpRequest?
						new XMLHttpRequest():
						new ActiveXObject('Microsoft.XMLHTTP');
			},
		// Guess XHR version
		xhr2=(getXHR().responseType===''),

	// Core function
	qwest=function(method,url,data,options,before){

		// Format
		method=method.toUpperCase();
		data=data || null;
		options=options || {};

		// Define variables
		var nativeResponseParsing=false,
			crossOrigin,
			xhr,
			xdr=false,
			timeoutInterval,
			aborted=false,
			retries=0,
			headers={},
			mimeTypes={
				text: '*/*',
				xml: 'text/xml',
				json: 'application/json',
				arraybuffer: null,
				formdata: null,
				document: null,
				file: null,
				blob: null
			},
			contentType='Content-Type',
			vars='',
			i,j,
			serialized,
			then_stack=[],
			catch_stack=[],
			complete_stack=[],
			response,
			success,
			error,
			func,

		// Define promises
		promises={
			then:function(func){
				if(options.async){
					then_stack.push(func);
				}
				else if(success){
					func.call(xhr,response);
				}
				return promises;
			},
			'catch':function(func){
				if(options.async){
					catch_stack.push(func);
				}
				else if(error){
					func.call(xhr,response);
				}
				return promises;
			},
			complete:function(func){
				if(options.async){
					complete_stack.push(func);
				}
				else{
					func.call(xhr);
				}
				return promises;
			}
		},
		promises_limit={
			then:function(func){
				request_stack[request_stack.length-1].then.push(func);
				return promises_limit;
			},
			'catch':function(func){
				request_stack[request_stack.length-1]['catch'].push(func);
				return promises_limit;
			},
			complete:function(func){
				request_stack[request_stack.length-1].complete.push(func);
				return promises_limit;
			}
		},

		// Handle the response
		handleResponse=function(){
			// Verify request's state
			// --- https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
			if(aborted){
				return;
			}
			// Prepare
			var i,req,p,responseType;
			--requests;
			// Clear the timeout
			clearInterval(timeoutInterval);
			// Launch next stacked request
			if(request_stack.length){
				req=request_stack.shift();
				p=qwest(req.method,req.url,req.data,req.options,req.before);
				for(i=0;func=req.then[i];++i){
					p.then(func);
				}
				for(i=0;func=req['catch'][i];++i){
					p['catch'](func);
				}
				for(i=0;func=req.complete[i];++i){
					p.complete(func);
				}
			}
			// Handle response
			try{
				// Verify status code
				// --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
				if('status' in xhr && !/^2|1223/.test(xhr.status)){
					throw xhr.status+' ('+xhr.statusText+')';
				}
				// Init
				var responseText='responseText',
					responseXML='responseXML',
					parseError='parseError';
				// Process response
				if(nativeResponseParsing && 'response' in xhr && xhr.response!==null){
					response=xhr.response;
				}
				else if(options.responseType=='document'){
					var frame=doc.createElement('iframe');
					frame.style.display='none';
					doc.body.appendChild(frame);
					frame.contentDocument.open();
					frame.contentDocument.write(xhr.response);
					frame.contentDocument.close();
					response=frame.contentDocument;
					doc.body.removeChild(frame);
				}
				else{
					// Guess response type
					responseType=options.responseType;
					if(responseType=='auto'){
						if(xdr){
							responseType=defaultXdrResponseType;
						}
						else{
							switch(xhr.getResponseHeader(contentType)){
								case mimeTypes.json:
									responseType='json';
									break;
								case mimeTypes.xml:
									responseType='xml';
									break;
								default:
									responseType='text';
							}
						}
					}
					// Handle response type
					switch(responseType){
						case 'json':
							try{
								if('JSON' in win){
									response=JSON.parse(xhr[responseText]);
								}
								else{
									response=eval('('+xhr[responseText]+')');
								}
							}
							catch(e){
								throw "Error while parsing JSON body : "+e;
							}
							break;
						case 'xml':
							// Based on jQuery's parseXML() function
							try{
								// Standard
								if(win.DOMParser){
									response=(new DOMParser()).parseFromString(xhr[responseText],'text/xml');
								}
								// IE<9
								else{
									response=new ActiveXObject('Microsoft.XMLDOM');
									response.async='false';
									response.loadXML(xhr[responseText]);
								}
							}
							catch(e){
								response=undefined;
							}
							if(!response || !response.documentElement || response.getElementsByTagName('parsererror').length){
								throw 'Invalid XML';
							}
							break;
						default:
							response=xhr[responseText];
					}
				}
				// Execute 'then' stack
				success=true;
				p=response;
				if(options.async){
					for(i=0;func=then_stack[i];++i){
						p=func.call(xhr,p);
					}
				}
			}
			catch(e){
				error=true;
				// Execute 'catch' stack
				if(options.async){
					for(i=0;func=catch_stack[i];++i){
						func.call(xhr,e+' ('+url+')');
					}
				}
			}
			// Execute complete stack
			if(options.async){
				for(i=0;func=complete_stack[i];++i){
					func.call(xhr);
				}
			}
		},

		// Recursively build the query string
		buildData=function(data,key){
			var res=[],
				enc=encodeURIComponent,
				p;
			if(typeof data==='object' && data!=null) {
				for(p in data) {
					if(data.hasOwnProperty(p)) {
						var built=buildData(data[p],key?key+'['+p+']':p);
						if(built!==''){
							res=res.concat(built);
						}
					}
				}
			}
			else if(data!=null && key!=null){
				res.push(enc(key)+'='+enc(data));
			}
			return res.join('&');
		};

		// New request
		++requests;

		// Normalize options
		options.async='async' in options?!!options.async:true;
		options.cache='cache' in options?!!options.cache:(method!='GET');
		options.dataType='dataType' in options?options.dataType.toLowerCase():'post';
		options.responseType='responseType' in options?options.responseType.toLowerCase():'auto';
		options.user=options.user || '';
		options.password=options.password || '';
		options.withCredentials=!!options.withCredentials;
		options.timeout=options.timeout?parseInt(options.timeout,10):3000;
		options.retries=options.retries?parseInt(options.retries,10):3;

		// Guess if we're dealing with a cross-origin request
		i=url.match(/\/\/(.+?)\//);
		crossOrigin=i && i[1]?i[1]!=location.host:false;

		// Prepare data
		if('ArrayBuffer' in win && data instanceof ArrayBuffer){
			options.dataType='arraybuffer';
		}
		else if('Blob' in win && data instanceof Blob){
			options.dataType='blob';
		}
		else if('Document' in win && data instanceof Document){
			options.dataType='document';
		}
		else if('FormData' in win && data instanceof FormData){
			options.dataType='formdata';
		}
		switch(options.dataType){
			case 'json':
				data=JSON.stringify(data);
				break;
			case 'post':
				data=buildData(data);
		}

		// Prepare headers
		if(options.headers){
			var format=function(match,p1,p2){
				return p1+p2.toUpperCase();
			};
			for(i in options.headers){
				headers[i.replace(/(^|-)([^-])/g,format)]=options.headers[i];
			}
		}
		if(!headers[contentType] && method!='GET'){
			if(options.dataType in mimeTypes){
				if(mimeTypes[options.dataType]){
					headers[contentType]=mimeTypes[options.dataType];
				}
			}
			else{
				headers[contentType]='application/x-www-form-urlencoded';
			}
		}
		if(!headers.Accept){
			headers.Accept=(options.responseType in mimeTypes)?mimeTypes[options.responseType]:'*/*';
		}
		if(!crossOrigin && !headers['X-Requested-With']){ // because that header breaks in legacy browsers with CORS
			headers['X-Requested-With']='XMLHttpRequest';
		}

		// Prepare URL
		if(method=='GET'){
			vars+=data;
		}
		if(!options.cache){
			if(vars){
				vars+='&';
			}
			vars+='__t='+(+new Date());
		}
		if(vars){
			url+=(/\?/.test(url)?'&':'?')+vars;
		}

		// The limit has been reached, stock the request
		if(limit && requests==limit){
			request_stack.push({
				method	: method,
				url		: url,
				data	: data,
				options	: options,
				before	: before,
				then	: [],
				'catch'	: [],
				complete: []
			});
			return promises_limit;
		}

		// Send the request
		var send=function(){
			// Get XHR object
			xhr=getXHR();
			if(crossOrigin){
				if(!('withCredentials' in xhr) && win.XDomainRequest){
					xhr=new XDomainRequest(); // CORS with IE8/9
					xdr=true;
					if(method!='GET' && method!='POST'){
						method='POST';
					}
				}
			}
			// Open connection
			if(xdr){
				xhr.open(method,url);
			}
			else{
				xhr.open(method,url,options.async,options.user,options.password);
				if(xhr2 && options.async){
					xhr.withCredentials=options.withCredentials;
				}
			}
			// Set headers
			if(!xdr){
				for(var i in headers){
					xhr.setRequestHeader(i,headers[i]);
				}
			}
			// Verify if the response type is supported by the current browser
			if(xhr2 && options.responseType!='document'){ // Don't verify for 'document' since we're using an internal routine
				try{
					xhr.responseType=options.responseType;
					nativeResponseParsing=(xhr.responseType==options.responseType);
				}
				catch(e){}
			}
			// Plug response handler
			if(xhr2 || xdr){
				xhr.onload=handleResponse;
			}
			else{
				xhr.onreadystatechange=function(){
					if(xhr.readyState==4){
						handleResponse();
					}
				};
			}
			// Override mime type to ensure the response is well parsed
			if(options.responseType!=='auto' && 'overrideMimeType' in xhr){
				xhr.overrideMimeType(mimeTypes[options.responseType]);
			}
			// Run 'before' callback
			if(before){
				before.call(xhr);
			}
			// Send request
			if(xdr){
				setTimeout(function(){ // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
					xhr.send();
				},0);
			}
			else{
				xhr.send(method!='GET'?data:null);
			}
		};

		// Timeout/retries
		var timeout=function(){
			timeoutInterval=setTimeout(function(){
				aborted=true;
				xhr.abort();
				if(!options.retries || ++retries!=options.retries){
					aborted=false;
					timeout();
					send();
				}
				else{
					aborted=false;
					error=true;
					response='Timeout ('+url+')';
					if(options.async){
						for(i=0;func=catch_stack[i];++i){
							func.call(xhr,response);
						}
					}
				}
			},options.timeout);
		};

		// Start the request
		timeout();
		send();

		// Return promises
		return promises;

	};

	// Return external qwest object
	var create=function(method){
			return function(url,data,options){
				var b=before;
				before=null;
				return qwest(method,url,data,options,b);
			};
		},
		obj={
			before: function(callback){
				before=callback;
				return obj;
			},
			get: create('GET'),
			post: create('POST'),
			put: create('PUT'),
			'delete': create('DELETE'),
			xhr2: xhr2,
			limit: function(by){
				limit=by;
			},
			setDefaultXdrResponseType: function(type){
				defaultXdrResponseType=type.toLowerCase();
			}
		};
	return obj;

}()));

},{}],5:[function(require,module,exports){
"use strict";

// Config loads and prepares the config file. The modules that does the
// actual transformations of the dataset are located in transforms/config.

var type    = require('./utils/type.js');
var config  = null;
var qwest   = require('qwest');

module.exports = {
    // Pass a list of string arguments as the full path for the object
    // you're looking for. E.g.: 'tilesets', 'space', 'tiles' for the
    // tile settings for the space tileset.
    get: function() {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 0) {
            return null;
        }
        if (config == null) {
            console.log('config is empty');
            return null;
        }
        return crawl(args);
    },

    load: function(callback) {
        var cb = function(value) {
            if (!type(callback).is_undefined) {
                callback(value);
            }
        };

        // TODO: both name of config file and port number should
        // be inserted by Yeoman(?). Maybe the settings can be
        // stored in package.json?
        qwest.get('http://localhost:5000/config.json')
            .then(function(response) {
                config = response;

                // var pipeline = require('transforms/pipeline');
                // var transforms = require('transforms/config/index');

                // pipeline(config)
                //     .pipe(transforms.tileset_index_range)
                //     .pipe(transforms.tile_settings);

                cb(true);
            })
            .catch(function(message) {
                console.error(message);
                cb(false);
            });
    }
};

function crawl(args) {
    var arg = '';
    var obj = config;

    // TODO: Use Array foreach instead

    for (var i=0, j=args.length; i<j; i++) {
        arg = args[i];
        obj = obj[arg];
        if (type(obj).is_undefined) {
            console.warn('Config cannot find '+args.join('.'));
            return null;
        }
    }
    return obj;
}

},{"./utils/type.js":26,"qwest":4}],6:[function(require,module,exports){
var list = require('./../utils/list.js');

function Grid(width, height, value) {
    var w = width;
    var h = height;

    var instance = {
        data:   [],
        tiles:  [],
        name:   'Unnamed',
        seed:   1,

        init: function(value) {
            value = value || 0;
            for (var i=0, l=w * h; i<l; i++) {
                this.data.push(value);
                this.tiles.push(value);
            }
        }
    };

    if (typeof value !== 'undefined') {
        instance.init(value);
    }

    get(instance, 'width', function() {
        return w;
    });

    get(instance, 'height', function() {
        return this.data.length / w;
    });

    get(instance, 'length', function() {
        return this.data.length;
    });

    return instance;
}

function get(obj, prop, cb) {
    Object.defineProperty(obj, prop, {
        get: cb,
        enumerable: true
    });
}

function set(obj, prop, cb) {
    Object.defineProperty(obj, prop, {
        set:        cb,
        enumerable: true
    });
}

function getset(obj, prop, get_cb, set_cb) {
    Object.defineProperty(obj, prop, {
        // get:        get_cb,
        // set:        set_cb,
        enumerable: true,
        writable:   true,
        configurable:   true
    });
}

module.exports.create = function(width, height, value) {
    return new Grid(width, height, value);
}

},{"./../utils/list.js":25}],7:[function(require,module,exports){
"use strict";

// THOUGHTS:
// - To add a more boat-like feel to the movement, a slowdown on stop would
//   be nice. Also a bit of slowness at start.
// - Turning radius should be a factor of speed. Greater radius at greater
//   speeds.
var sprite;
var speed = 2;
var dir = {x:0, y:0};

module.exports.create = function(game, x, y) {
    sprite = game.add.sprite(x, y, 'sprites01');
    sprite.anchor.setTo(0.5, 0.5);
};

module.exports.update = function(cursors, pointer) {

    if (cursors.up.isDown) {
        dir.y = -1;
        dir.x = !cursors.right.isDown && !cursors.left.isDown ? 0 : dir.x;
    } else if (cursors.down.isDown) {
        dir.y = 1;
        dir.x = !cursors.right.isDown && !cursors.left.isDown ? 0 : dir.x;
    }

    if (cursors.right.isDown) {
        dir.x = 1;
        dir.y = !cursors.up.isDown && !cursors.down.isDown ? 0 : dir.y;
    } else if (cursors.left.isDown) {
        dir.x = -1;
        dir.y = !cursors.up.isDown && !cursors.down.isDown ? 0 : dir.y;
    }

    // sprite.x -= speed;
    // sprite.y -= speed;

    log(Math.atan2(dir.y, dir.x));
};

},{}],8:[function(require,module,exports){
"use strict";

var config      = require('./config.js');
var dom         = require('./utils/dom.js');
var game_config = null;

// TODO: Add new states via Yeoman. This list needs to be dynamically
// recreated.

var boot        = require('./states/boot.js');
var preloader   = require('./states/preloader.js');
var generate    = require('./states/generate.js');
var worldmap    = require('./states/worldmap.js');
var boat        = require('./states/boat.js');
var game_state  = require('./states/game.js');

module.exports = function() {
    config.load(function() {
        game_config = config.get('game');
        dom.add_game_node();

        var game = new Phaser.Game(game_config.width, game_config.height,
                                   Phaser.CANVAS,
                                   game_config.dom_element_id,
                                   null, false, false);

        game.state.add('Boot',      boot);
        game.state.add('Preloader', preloader);
        game.state.add('Generate',  generate);
        game.state.add('Worldmap',  worldmap);
        game.state.add('Game',      game_state);
        game.state.add('Boat',      boat);

        game.state.start('Boot');
    });
}

},{"./config.js":5,"./states/boat.js":14,"./states/boot.js":15,"./states/game.js":16,"./states/generate.js":17,"./states/preloader.js":18,"./states/worldmap.js":19,"./utils/dom.js":23}],9:[function(require,module,exports){
var list        = require('./../utils/list.js');
// var inverter    = require('transforms/grid/inverter');
// var rooms       = require('transforms/grid/rooms');

var data = null;
var data_string = null;
var options = {};

module.exports = {
    generate: function(grid, opt) {
        options = opt || {
            seed:       1,
            smoothness: 1,
            padding:    1,
            value_a:    0,
            value_b:    1
        };

        Math.seed = options.seed;

        list.each(grid.data, grid.width, function(item, x, y, i) {
            if ((x < options.padding) ||
                (y < options.padding) ||
                (x >= grid.width - options.padding) ||
                (y >= grid.width - options.padding)) {
                grid.data[i] = 0;
            } else {
                grid.data[i] = ~~Math.seededRandom(0, 2);
            }
        });

        generateCells(grid, options);

        // inverter.invert(data);

        // rooms.identify(0, data);
        // rooms.closeAll(data);
        // rooms.open(0, data);

        // addOutlineWalls();
        // addHeight();

        // list.print(grid.data);

    }
};

function generateCells(grid, options) {
    for (var i = 0; i < options.smoothness; i++) {

        var new_map = [];
        list.fill(new_map, grid.width * grid.width, 0);

        var x_low = -1;
        var x_high = -1;
        var y_low = -1;
        var y_high = -1;
        var neighbours = 0;
        var cur_tile_value = -1;
        var corner = false;
        var val = -1;

        list.each(new_map, grid.width, function(tile, x, y, i) {

            x_low = Math.max(0, x - 1);
            x_high = Math.min(grid.width - 1, x + 1);

            y_low = Math.max(0, y - 1);
            y_high = Math.min(grid.width - 1, y + 1);

            neighbours = 0;

            for (var a = x_low; a <= x_high; a++) {
                for (var b = y_low; b <= y_high; b++) {
                    if ((a === x) && (b === y)) {
                        continue;
                    }
                    neighbours += 1 - get(grid, a, b);
                }
            }

            cur_tile_value = get(grid, x, y);

            corner = (x === 0 && y === 0) ||
                     (x === grid.width-1 && y === 0) ||
                     (x === 0 && y === grid.height-1) ||
                     (x === grid.width-1 && y === grid.height-1);

            val = (corner ||
                  (cur_tile_value === 0 && neighbours >= 4) ||
                  (cur_tile_value === 1 && neighbours >= 5)) ? 0 : 1;

            list.set(new_map, x, y, grid.width, val);

        });

        new_map.forEach(function(value, i) {
            grid.data[i] = new_map[i];
        });
    }

    grid.data.forEach(function(value, i) {
        grid.data[i] = value === 0 ? options.value_a : options.value_b;
    });
}

function get(grid, x, y) {
    return list.get(grid.data, x, y, grid.width);
}

// function filter(data, data_types) {
//     data.forEach(function(data_value, i) {
//         data[i] = filterValue(data_value, data_types);
//     });
// }

// function filterValue(value, data_types) {
//     for (var i=0; i<data_types.length; i++) {
//         var dtype = data_types[i];
//         if (value >= dtype.lower && value < dtype.upper) {
//             return dtype.value;
//         }
//     }
// }

// TODO:
// addHeight and addOutlineWalls are actually transformers, and should
// be put in separate files.

// function addHeight() {
//     data.each(function(tile, x, y) {
//         if (tile === 0 &&
//             data.get(x, y - 1) === 1) {
//             data.set(x, y, 2);
//         }
//     });
// }

// function addOutlineWalls() {
//     data.each(function(tile, x, y) {
//         if (tile === 0) {
//             if (((x > 0) && (data.get(x - 1, y) === 1)) ||
//                 ((y > 0) && (data.get(x, y - 1) === 1)) ||
//                 ((x < data.width - 1) && (data.get(x + 1, y) === 1)) ||
//                 ((y < data.width - 1) && (data.get(x, y + 1) === 1))) {
//                     data.set(x, y, 2);
//                 }
//         }

//     });
// }

},{"./../utils/list.js":25}],10:[function(require,module,exports){

var endings = ['os', 'ia'];
var beginnings = ['Nax', 'Lesb', 'K', 'Icar', 'Tin', 'Skyr'];

module.exports.generate = function() {
    var b = rnd(beginnings);
    var e = rnd(endings);
    return b+e;
};

function rnd(list) {
    return list[Math.round(Math.random() * (list.length-1))];
}

},{}],11:[function(require,module,exports){
"use strict";

var list            = require('./../utils/list.js');
var type            = require('./../utils/type.js');
var grid            = require('./../data/grid.js');
var automata        = require('./cellular_automata.js');
var automata        = require('./cellular_automata.js');
var island_name     = require('./island_name.js');
// var remapper        = require('transforms/grid/remap');
var rooms           = require('./../transforms/grid/rooms.js');
var config          = require('./../config.js');
var tilemapper      = require('./../tilemapper.js');

var world           = {};
var cfg             = null;
var map_cfg         = null;
var data_types      = null;

module.exports.generate = function(x, y, type) {
    if (exists(x, y)) {
        return;
    }

    cfg = config.get('world_segment');
    map_cfg = config.get('map');
    data_types = map_cfg.data_types;
    addToCache(x, y);

    var segment = world[x][y] = grid.create(cfg.width, cfg.height, 0);
    segment.seed = Math.round(Math.random() * 10000);

    // info(data_types, type, x, y, segment.seed);

    if (type === 0) {
        // TODO: Generate sea name
        segment.name = 'Fishing sea';
        generateFishingSea(segment);
    }

    if (type === 1) {
        segment.name = 'null';
        generateShallowSea(segment);
    }

    if (type === 2) {
        segment.name = island_name.generate();
        generateIsland(segment, {
            seed:       segment.seed,
            smoothness: cfg.smoothness,
            padding:    cfg.padding,
            value_a:    getDataTypeValue('Shallow sea'),
            value_b:    getDataTypeValue('Island')
        });
    }

    // list.print(segment.data);

    tilemapper.map(segment, data_types, map_cfg.tilemaps.segment);
};

module.exports.get = function(x, y) {
    if (!exists(x, y)) {
        return null;
    }

    return world[x][y];
};

// put this somewhere else. In config? Maybe a map helper, or something.
function getDataTypeValue(name) {
    var dt;
    for (var i=0; i<data_types.length; i++) {
        dt = data_types[i];
        if (dt.name === name) {
            return dt.value;
        }
    }
    return null;
}

function generateIsland(segment, opts) {

    // TODO: Make automata a Stream
    // https://github.com/winterbe/streamjs
    automata.generate(segment, opts);

    // Remap 0's to 1's and 1's to 2's.
    // Should be better integrated with config.
    // datatype.get('Island')
    // datatype.get('Shallow sea')
    // remapper.remap(segment.data, {
    //     0: 1,
    //     1: 2
    // });

    rooms.identify(getDataTypeValue('Island'), segment);

    Object.keys(rooms.rooms).forEach(function(index) {
        var room_tiles = rooms.rooms[index];
        if (room_tiles.length < 10) {
            room_tiles.forEach(function(tile_index) {
                segment.data[tile_index] = getDataTypeValue('Sand');
            });
        }
    });
}

function generateFishingSea(segment) {
    list.each(segment.data, segment.width, function(tile, x, y, i) {
        if ((x < 5) ||
            (x > segment.width - 6) ||
            (y < 5) ||
            (y > segment.height - 6)) {
            segment.data[i] = getDataTypeValue('Shallow sea');
        } else {
            segment.data[i] = getDataTypeValue('Deep sea');
        }
    });
}

function generateShallowSea(segment) {
    list.each(segment.data, segment.width, function(tile, x, y, i) {
        segment.data[i] = getDataTypeValue('Shallow sea');
    });
}

function exists(x, y) {
    if (type(x).is_undefined) {
        console.log('Segment.exists : Missing x');
        return false;
    }

    if (!type(world[x]).is_undefined) {
        if (type(y).is_undefined) {
            return true;
        }
        if (!type(world[x][y]).is_undefined) {
            return true;
        }
    }
    return false;
}

function addToCache(x, y) {
    if (!exists(x)) {
        world[x] = {};
    }
    if (!exists(x, y)) {
        world[x][y] = {};
    }
}

function info(data_types, type, x, y, seed) {
    var n = '';
    data_types.forEach(function(dt) {
        if (dt.value === type) {
            n = dt.name;
        }
    });

    log('segment type:'+n+' ('+type+') x:'+x+' y:'+y+' seed:'+seed);
}

},{"./../config.js":5,"./../data/grid.js":6,"./../tilemapper.js":20,"./../transforms/grid/rooms.js":21,"./../utils/list.js":25,"./../utils/type.js":26,"./cellular_automata.js":9,"./island_name.js":10}],12:[function(require,module,exports){
var config          = require('./../config.js');
var PerlinGenerator = require('proc-noise');
var grid            = require('./../data/grid.js');
var list            = require('./../utils/list.js');
var type            = require('./../utils/type.js');

var map = {};
var cfg = {};

module.exports.generate = function(data_types, seed) {
    cfg = config.get('world');

    var Perlin = new PerlinGenerator(seed);
    var noise = [];
    var scale = 1 / cfg.noise_scale;

    map = grid.create(cfg.width, cfg.height, 0);

    list.fill(noise, map.width * map.height, 0)
        .each(noise, map.width, function(tile, x, y, i) {
            noise[i] = Perlin.noise(x * scale, y * scale);
        });

    filter(noise, map, data_types);

    list.print(map.data);
};

function filter(data, grid, config) {
    data.forEach(function(data_value, i) {
        grid.data[i] = filterValue(data_value, config);
    });
}

function filterValue(value, config) {
    for (var i=0; i<config.length; i++) {
        var cfg = config[i];
        if (type(cfg.lower).is_undefined &&
            type(cfg.upper).is_undefined) {
            continue;
        }
        if (value >= cfg.lower && value < cfg.upper) {
            return cfg.value;
        }
    }
}

Object.defineProperty(module.exports, 'map', {
    get: function() { return map; }
});

},{"./../config.js":5,"./../data/grid.js":6,"./../utils/list.js":25,"./../utils/type.js":26,"proc-noise":2}],13:[function(require,module,exports){
"use strict";

var tilemaps = {};

module.exports.loadTilemap = function(game, options) {
    options.tile_size = options.tile_size || 16;
    options.layer_index = options.layer_index || 0;

    game.load.tilemap(options.map_name, null, options.data);

    var ref = tilemaps[options.map_name] = {map: null, layer: null};

    ref.map = game.add.tilemap(options.map_name, options.tile_size, options.tile_size);
    ref.map.addTilesetImage(options.tileset);

    ref.layer = ref.map.createLayer(options.layer_index);
    ref.layer.resizeWorld();
}

module.exports.layer = function(name) {
    var tilemap = tilemaps[name];
    return tilemap ? tilemap.layer : null;
}

},{}],14:[function(require,module,exports){
"use strict";

module.exports = new Phaser.State();

var config          = require('./../config.js');
var list            = require('./../utils/list.js');
var tilemaps        = require('./../helpers/phaser/tilemaps.js');
var segment         = require('./../generators/segment.js');
var boat            = require('./../entities/boat.js');

var game;
// TODO: Bundle cursors and pointer in an input manager. The input manager
// accepts a key mapping object from config
var cursors;
var pointer;

module.exports.init = function(options) {
    segment.generate(0, 0, 1);
};

module.exports.create = function() {
    var game_config = config.get('game');

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;

    var seg = segment.get(0, 0);

    tilemaps.loadTilemap(game, {
        map_name:   'BoatPracticing',
        data:       list.printString(seg.tiles),
        tileset:    'tilemap-simple'
    });

    cursors = game.input.keyboard.createCursorKeys();
    pointer = game.input.activePointer;

    var map = tilemaps.layer('BoatPracticing').map;

    boat.create(game, map.tileWidth * 16, map.tileHeight * 16);

    // cursor keys
    // add boat
        // can be driven by cursor keys
        // can be driven by point and click
            // needs to know the mouse cursor position to rotate
            // needs pathfinding
    // set collision tiles

    // keep in mind:
    // - boat needs an update routine that knows that kind of tile it is on.
        // Use Phaser tile callbacks? They need to be reset between each
        // map switch.
};

module.exports.update = function() {
    boat.update(cursors, pointer);
};

},{"./../config.js":5,"./../entities/boat.js":7,"./../generators/segment.js":11,"./../helpers/phaser/tilemaps.js":13,"./../utils/list.js":25}],15:[function(require,module,exports){
"use strict";

var config = require('./../config.js');

module.exports = new Phaser.State();

module.exports.create = function() {
    var game_config = config.get('game');
    var game = this.game;
    var scale = game.scale;

    game.input.maxPointers = 1;
    game.antialias = false;
    Phaser.Canvas.setSmoothingEnabled(game.context, false);

    game.stage.scaleMode = Phaser.ScaleManager.NO_SCALE;
    scale.maxWidth = game_config.width;
    scale.maxHeight = game_config.height;
    scale.forceLandscape = true;
    scale.pageAlignHorizontally = true;
    scale.pageAlignVertically = true;
    scale.setScreenSize(true);

    // TODO: Doesn't work in Chrome. Get's reset
    game.context.imageSmoothingEnabled = false;
    game.context.mozImageSmoothingEnabled = false;
    game.context.oImageSmoothingEnabled = false;
    game.context.webkitImageSmoothingEnabled = false;
    game.context.msImageSmoothingEnabled = false;

    game.renderer.renderSession.roundPixels = true;

    game.state.start('Preloader');
};

},{"./../config.js":5}],16:[function(require,module,exports){
"use strict";

module.exports = new Phaser.State();

var config          = require('./../config.js');
var list            = require('./../utils/list.js');
var tilemaps        = require('./../helpers/phaser/tilemaps.js');
var segment         = require('./../generators/segment.js');

var game            = null;
var coordinate      = {x: -1, y: -1};
var key_map         = null;

module.exports.init = function(options) {
    if (typeof options === 'undefined') {
        console.log('Game state is missing options');
        return;
    }

    coordinate.x = options.x;
    coordinate.y = options.y;

    segment.generate(options.x, options.y, options.map_type);
};

module.exports.create = function() {
    var game_config = config.get('game');

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;

    var seg = segment.get(coordinate.x, coordinate.y);

    tilemaps.loadTilemap(game, {
        map_name:   seg.name,
        data:       list.printString(seg.tiles),
        tileset:    'tilemap-simple'
    });

    game.add.bitmapText(16, 16, 'Gamegirl', '[M] Return to worldmap', 8);
    game.add.bitmapText(16, 32, 'Gamegirl', seg.name, 8);

    key_map = game.input.keyboard.addKey(Phaser.Keyboard.M);
    key_map.onUp.add(returnToWorldmap, this);
};

module.exports.shutdown = function() {
    key_map.onUp.remove(returnToWorldmap);
};

function returnToWorldmap() {
    game.state.start('Worldmap');
}

},{"./../config.js":5,"./../generators/segment.js":11,"./../helpers/phaser/tilemaps.js":13,"./../utils/list.js":25}],17:[function(require,module,exports){
"use strict";

module.exports = new Phaser.State();

var world       = require('./../generators/world.js');
var tilemapper  = require('./../tilemapper.js');
var config      = require('./../config.js');

module.exports.create = function() {

    // TODO: Store the seed in a save game, e.g. localStorage.
    window.seed = Math.round(Math.random() * 10000);

    var map_cfg = config.get('map');
    world.generate(map_cfg.data_types, window.seed);

    tilemapper.map(world.map, map_cfg.data_types, map_cfg.tilemaps.worldmap);

    this.game.state.start('Worldmap');

    // this.game.state.start('Game', true, false, {
    //     map_type:   2,
    //     x:          0,
    //     y:          0
    // });

};

},{"./../config.js":5,"./../generators/world.js":12,"./../tilemapper.js":20}],18:[function(require,module,exports){
"use strict";

var config = require('./../config.js');

module.exports = new Phaser.State();

module.exports.preload = function() {
    var assets = config.get('preload');
    Object.keys(assets).forEach(function(type) {
        Object.keys(assets[type]).forEach(function(id) {
            this.game.load[type].apply(this.game.load,
                                       [id].concat(assets[type][id]));
        }.bind(this));
    }.bind(this));
};

module.exports.update = function() {
    if (this.game.load.hasLoaded) {

        // TODO:
        // There should be an easy way to get the next state without
        // knowing the name of the state

        // this.game.state.start('Boat');
        this.game.state.start('Generate');

    }
};

},{"./../config.js":5}],19:[function(require,module,exports){
"use strict";

module.exports = new Phaser.State();

var config          = require('./../config.js');
var list            = require('./../utils/list.js');
var tilemaps        = require('./../helpers/phaser/tilemaps.js');
var world           = require('./../generators/world.js');
var unobtrusive     = require('./../ui/components/unobtrusive_label.js');

var marker      = {x:0, y:0};
var cur_tile    = {x:0, y:0};
var layer       = {};
var tilesize    = 32;
var pointer     = {};
var game        = null;

var pick_island_label = null;

module.exports.create = function() {
    var game_config = config.get('game');
    var mapname = 'worldmap';

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;
    pointer = game.input.activePointer;

    tilemaps.loadTilemap(game, {
        map_name:       mapname,
        data:           list.printString(world.map.tiles),
        tile_size:      tilesize,
        tileset:        'worldmap-simple'
    });

    marker = game.add.sprite(0, 0, 'sprites');
    layer = tilemaps.layer(mapname);

    game.add.bitmapText(16, 16, 'Gamegirl', 'Worldmap', 8);

    pick_island_label = unobtrusive.create({
        game:   game,
        sprite: 'label-pick-island'
    });

    game.input.onUp.add(click, this);
};

module.exports.update = function() {
    cur_tile.x = layer.getTileX(pointer.worldX);
    cur_tile.y = layer.getTileY(pointer.worldY);

    marker.x = cur_tile.x * tilesize;
    marker.y = cur_tile.y * tilesize;

    pick_island_label.update(pointer);
};

function click() {
    var map_type = list.get(world.map.data,
                            cur_tile.x,
                            cur_tile.y,
                            world.map.width);

    game.input.onUp.remove(click, this);

    game.state.start('Game', true, false, {
        map_type:   map_type,
        x:          cur_tile.x,
        y:          cur_tile.y
    });
}

},{"./../config.js":5,"./../generators/world.js":12,"./../helpers/phaser/tilemaps.js":13,"./../ui/components/unobtrusive_label.js":22,"./../utils/list.js":25}],20:[function(require,module,exports){
var gridcreator     = require('./data/grid.js');
var list            = require('./utils/list.js');

module.exports.map = function(grid, data_types, tilemap) {
    list.each(grid.data, grid.width, function(tile_value, x, y, i) {
        grid.tiles[i] = tilemap[tile_value];
    });
};

},{"./data/grid.js":6,"./utils/list.js":25}],21:[function(require,module,exports){
var list = require('./../../utils/list.js');

var rooms = {};

module.exports = {
    identify: function(index, grid) {

        var data = [];
        var rooms_tmp = [];

        list.each(grid.data, grid.width, function(tile, x, y, i) {
            data.push(tile);
        });

        data.forEach(function(tile, i) {
            if (tile === index && !inCache(rooms_tmp, tile)) {
                rooms_tmp.push({});
                crawl(data, grid.width, i, rooms_tmp[rooms_tmp.length-1]);
            }
        });

        rooms_tmp.forEach(function(room, i) {
            var indexes = Object.keys(room);
            rooms[i] = [];
            var r = rooms[i];

            indexes.forEach(function(index) {
                r.push(parseInt(index));
            });
        });
    },

    closeAll: function(grid) {
        Object.keys(rooms).forEach(function(room_num) {
            close(room_num, grid);
        });
    },

    open: function(room_num, grid) {
        if (!rooms[room_num]) {
            return;
        }

        var room = rooms[room_num];
        room.forEach(function(tile) {
            grid._[tile] = 0;
        });
    }
};

function close(room_num, grid) {
    var room = rooms[room_num];
    room.forEach(function(tile) {
        grid._[tile] = 1;
    });
}

function inCache(cache, index) {
    if (cache.length === 0) {
        return false;
    }

    for (var i=0; i<cache.length; i+=1) {
        var group = cache[i];
        return group[index] ? true : false;
    }
}

function crawl(data, width, i, container) {
    var index = data[i];
    var right = i+1;
    var left = i-1;
    var below = i+width;
    var above = i-width;

    data[i] = 3;
    container[i] = true;

    if (data[right] === index) {
        crawl(data, width, right, container);
    }
    if (data[left] === index) {
        crawl(data, width, left, container);
    }
    if (data[below] === index) {
        crawl(data, width, below, container);
    }
    if (data[above] === index) {
        crawl(data, width, above, container);
    }
}

Object.defineProperty(module.exports, 'rooms', {
    get: function() { return rooms; }
});

},{"./../../utils/list.js":25}],22:[function(require,module,exports){
"use strict";

// TODO:
// - set anchor
// - add support for bitmap text
// - use 9grid slicing for the background. Blit everything to a bitmapdata

function UnobtrusiveLabel(opts) {
    this.opts = opts || {
        game:   null,
        sprite: 'N/A'
    };

    if (opts.game === null) {
        console.log('Unobtrusive label could not be created. '+
                    'Pass a reference to game.');
        return;
    }

    this.label = this.opts.game.add.image(0, 0, this.opts.sprite);
    this.bottom = this.opts.game.world.height - (this.label.height * 2);
    this.top = this.label.height;

    this.label.x = this.opts.game.world.centerX - (this.label.width / 2);
    this.label.y = this.bottom;

    this.labelAtBottom = true;

    // this.tweenBottomOut = this.opts.game.add.tween(this.label);
    // this.tweenBottomIn = this.opts.game.add.tween(this.label);
    // this.tweenTopIn = this.opts.game.add.tween(this.label);
    // this.tweenTopOut = this.opts.game.add.tween(this.label);
}

UnobtrusiveLabel.prototype.update = function(pointer) {
    if (pointer.worldY > this.bottom && this.labelAtBottom) {
        this.labelAtBottom = false;
        this.tweenBottomOut = this.opts.game.add.tween(this.label).to({ y: this.opts.game.world.height }, 200, Phaser.Easing.Quadratic.Out, true);
        this.tweenBottomOut.onComplete.addOnce(this.fromAbove, this);
    }

    if (pointer.worldY < (this.top * 2) && !this.labelAtBottom) {
        this.labelAtBottom = true;
        this.tweenTopOut = this.opts.game.add.tween(this.label).to({ y: -this.label.height }, 200, Phaser.Easing.Quadratic.Out, true);
        this.tweenTopOut.onComplete.addOnce(this.fromBelow, this);
    }
};

UnobtrusiveLabel.prototype.fromAbove = function() {
    this.tweenBottomOut.onComplete.removeAll();
    this.label.y = -this.label.height;
    this.tweenTopIn = this.opts.game.add.tween(this.label).to({ y: this.top }, 100, Phaser.Easing.Quadratic.In, true);
    this.tweenTopIn.onComplete.addOnce(this.topInDone, this);
};

UnobtrusiveLabel.prototype.fromBelow = function() {
    this.tweenTopOut.onComplete.removeAll();
    this.label.y = this.opts.game.world.height;
    this.tweenBottomIn = this.opts.game.add.tween(this.label).to({ y: this.bottom }, 100, Phaser.Easing.Quadratic.In, true);
    this.tweenBottomIn.onComplete.addOnce(this.bottomInDone, this);
};

UnobtrusiveLabel.prototype.topInDone = function() {
    this.tweenTopIn.onComplete.removeAll();
};

UnobtrusiveLabel.prototype.bottomInDone = function() {
    this.tweenBottomIn.onComplete.removeAll();
};

module.exports.create = function(opts) {
    return new UnobtrusiveLabel(opts);
}

},{}],23:[function(require,module,exports){
"use strict";

var config  = require('./../config.js');
var type_of = require('./type.js');

var tools_node = null;
var game_node = null;

function append_to_head(element) {
    document.getElementsByTagName('head')[0].appendChild(element);
};

function create_script(path) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = path;
    return script;
};

function create_node(id, parent_id) {
    var parent = document.body.nextSibling;
    if (!type_of(parent_id).is_undefined) {
        parent = document.getElementById(parent_id);
    }
    var div = document.createElement('div');
    div.setAttribute('id', id);
    document.body.insertBefore(div, parent);
    return div;
};

module.exports.add_game_node = function() {
    if (document) {
        game_node = create_node(config.get('game').dom_element_id);
        return game_node;
    }
    return null;
};

module.exports.inject_script = function(path, callback) {
    var script = create_script(config.get('game').host + path);
    script.onload = function() {
        if (!type_of(callback).is_undefined) {
            callback();
        }
    }
    append_to_head(script);
};

module.exports.inject_css = function(path, callback) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', config.get('game').host + path);
    append_to_head(link);
    if (!type_of(callback).is_undefined) {
        callback();
    }
};

Object.defineProperty(module.exports, 'game_node', {
    get: function() { return game_node; }
});

},{"./../config.js":5,"./type.js":26}],24:[function(require,module,exports){
Math.seededRandom = function(min, max) {
    min = min || 0;
    max = max || 1;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    return min + (Math.seed / 233280) * (max - min);
}

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

},{}],25:[function(require,module,exports){
module.exports.each = function(list, width, callback) {
    if (!callback) {
        console.warn('each() missing callback');
        return;
    }

    var x = 0;
    var y = 0;

    list.forEach(function(item, i) {
        x = i % width !== 0 ? x + 1 : 0;
        y = i > 0 && x === 0 ? y + 1 : y;
        callback(item, x, y, i);
    });
};

module.exports.get = function(arr, x, y, width) {
    return arr[(width * y) + x];
};

module.exports.set = function(arr, x, y, width, value) {
    arr[(width * y) + x] = value;
};

module.exports.fill = function(arr, length, value) {
    arr = arr || [];
    value = value || 0;

    for (var i=0; i<length; i+=1) {
        arr.push(value);
    }

    return module.exports;
};

module.exports.print = function(list, width) {
    var str = this.printString(list, width);
    console.log(str);
}

module.exports.printString = function(list, width) {
    if (!(list instanceof Array)) {
        console.log('list.print() needs an array');
        return;
    }

    if (typeof width === 'undefined') {
        var width = Math.sqrt(list.length);
        if (width % 1 !== 0) {
            console.log('list.print() cannot find the width for the current list');
            return;
        }
    }

    var str = '';

    this.each(list, width, function(tile, x, y, i) {
        str += i % width !== 0 ? ',' : '\n';
        str += tile;
    });

    return str;
}

},{}],26:[function(require,module,exports){
"use strict";

var type = '';

module.exports = function(element) {
    type = Object.prototype.toString.call(element);
    return module.exports;
};

Object.defineProperty(module.exports, 'is_object', {
    get: function() { return type === '[object Object]'; }
});
Object.defineProperty(module.exports, 'is_array', {
    get: function() { return type === '[object Array]'; }
});
Object.defineProperty(module.exports, 'is_string', {
    get: function() { return type === '[object String]'; }
});
Object.defineProperty(module.exports, 'is_date', {
    get: function() { return type === '[object Date]'; }
});
Object.defineProperty(module.exports, 'is_number', {
    get: function() { return type === '[object Number]'; }
});
Object.defineProperty(module.exports, 'is_num', {
    get: function() { return type === '[object Number]'; }
});
Object.defineProperty(module.exports, 'is_function', {
    get: function() { return type === '[object Function]'; }
});
Object.defineProperty(module.exports, 'is_fn', {
    get: function() { return type === '[object Function]'; }
});
Object.defineProperty(module.exports, 'is_regexp', {
    get: function() { return type === '[object RegExp]'; }
});
Object.defineProperty(module.exports, 'is_boolean', {
    get: function() { return type === '[object Boolean]'; }
});
Object.defineProperty(module.exports, 'is_bool', {
    get: function() { return type === '[object Boolean]'; }
});
Object.defineProperty(module.exports, 'is_null', {
    get: function() { return type === '[object Null]'; }
});
Object.defineProperty(module.exports, 'is_undefined', {
    get: function() { return type === '[object Undefined]'; }
});

},{}]},{},[1]);
