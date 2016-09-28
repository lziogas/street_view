var express = require('express');
var http = require('http');
//var request = require('request');
var router = express.Router();
const _ = require('underscore');

const url = 'http://storage.api.dmp.trafi.com:9090/dmp/dbs';

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
			const versions = [];

	    	var json = JSON.parse(body.substring(1, body.length));
	    	var promises = [];
	    	json.Dbs.forEach((i) => {
	    		promises.push(getNewestVersion(i.Id, i.Region));	
	    	});
	    	
	    	Promise.all(promises).then(values => {
				var regionArr = [];
				var regions = _.countBy(values, (obj) => {
					return obj.region;
				});
	    		
	    		for (key in regions) {
	    			var arr = values.filter((obj) => {
	    				return obj.region == key;
	    			});
	    			var regionObj = {
	    				region: key,
	    				ids: [],
	    				versions: []
	    			}
	    			arr.forEach((item) => {
	    				if (item.version !== null) {
	    					regionObj.ids.push(item.dbid);
	    					regionObj.versions.push(item.version);
	    				}	    						
	    			});
	    			regionArr.push(regionObj);
	    		}

	    		res.render('header', { regions: regionArr });
	    	}).catch((err) => {
	    		console.log(err)
	    	});
	    });
	});
	
});

module.exports = router;

function getNewestVersion(dbid, region) {
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
     				var sorted = _.sortBy(versions, 'Id');
     				resolve({version: sorted[sorted.length - 1].Id, dbid: json.DbId, region: region});
     			} else {
     				resolve({version: null, dbid: json.DbId, region: region});	
     			}
     		});
		})
	})
}

function getStops(version) {
	return new Promise((resolve, reject) => {
		http.get("http://storage.api.dmp.trafi.com:9090/dmp/db/version/" + version + "/stops", (response) => {
			if (response.statusCode < 200 || response.statusCode > 299) {
         		reject(new Error('Failed to load page, status code: ' + response.statusCode));
       		}
       		var body = "";
     		response.on('data', (chunk) => {
     			body += chunk;
     		});
     		response.on('end', () => {
     			var json = JSON.parse(body.substring(1, body.length));
     			console.log();
     		});
		})
	})
}
