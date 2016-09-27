var express = require('express');
var http = require('http');
//var request = require('request');
var router = express.Router();

const url = 'http://storage.api.dmp.trafi.com:9090/dmp/dbs';
const cities = [];
router.get('/', function(req, res, next) {
	var request = http.get("http://storage.api.dmp.trafi.com:9090/dmp/dbs", (response) => {
		var body = "";
		
	    response.on('data', function(chunk){
	        body += chunk;
	    });
	    response.on('error', function(err) {
	    	console.log(err)
	    })
	    response.on('end', function(){
	    	var json = JSON.parse(body.substring(1, body.length));
	    	var promises = [];
	    	json.Dbs.forEach((i) => {
	    		if (cities.indexOf(i.Region) < 0) {
	    			cities.push({id: i.Id, region: i.Region});
	    		}
	    		promises.push(getNewestVersion(i.Id));	
	    	});
	    	
	    	Promise.all(promises).then(values => {
				console.log(values);
	    	}).catch((err) => {
	    		console.log(err)
	    	});
	    });
	});
	
});

module.exports = router;

function getNewestVersion(dbid) {
	return new Promise((resolve, reject) => {
		http.get("http://storage.api.dmp.trafi.com:9090/dmp/ui/db/" + dbid +"/versions", (response) => {
			if (response.statusCode < 200 || response.statusCode > 299) {
         		reject(new Error('Failed to load page, status code: ' + response.statusCode));
       		}
       		var body = "";
     		response.on('data', (chunk) => {
     			body += chunk;
     		});
     		response.on('end', () => {
     			var json = JSON.parse(body.substring(1, body.length));
     			var versions = json.Versions;
     			if (versions.length > 0) {
     				// Kuris ID teisingas???
     				resolve({version: versions[versions.length - 1].Id, dbid: json.DbId});
     			} else {
     				resolve({version: null, dbid: json.DbId});	
     			}
     		});
		})
	})
}

function getStops() {

}
