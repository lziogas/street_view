var express = require('express');
var http = require('http');
var request = require('request');
var router = express.Router();

const url = 'http://storage.api.dmp.trafi.com:9090/dmp/dbs';

router.get('/', function(req, res, next) {

	var request = http.request("http://storage.api.dmp.trafi.com:9090/dmp/dbs", (response) => {
		var body = "";

	    response.on('data', function(chunk){
	        body += chunk;
	    });
	    response.on('error', function(err) {
	    	console.log(err)
	    })
	    response.on('end', function(){
	    	var json = JSON.parse(body.substring(1, body.length));
	    	console.log(typeof json);
	    });
	});
	request.end();
});

module.exports = router;
