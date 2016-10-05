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
			const allRegions = [];

	    	var json = JSON.parse(body.substring(1, body.length));
	    	json.Dbs.forEach((i) => {
	    		allRegions.push(i.Region);	
	    	});
	    	var regions = allRegions.filter((val, i, self) => {
	    		return self.indexOf(val) === i;
	    	});
			res.json({ regions: regions});
	    });
	});
	
});

router.post('/', function (req, res) {
	const region = req.body.region;
	const stopcount = req.body.stopcount;

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
	    	const ids = [];
	    	const promises = [];

	    	json.Dbs.forEach((obj) => {
	    		obj.Region == region ? ids.push(obj.Id) : "";
	    	});
	    	ids.forEach((i) => {
	    		promises.push(getNewestVersion(i));	
	    	});

	    	Promise.all(promises).then(values => {
	    		const stopPromises = [];
				values.forEach((version) => stopPromises.push(getStops(version)));
				Promise.all(stopPromises).then(stopArr => {
					var stops = _.flatten(stopArr)
					var randomStops = shuffle(stops).splice(0, stopcount);
					res.render('index', { stops: randomStops});
				}).catch((err) => {
	    			console.log(err)
	    		});

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
     				var sorted = _.sortBy(versions, 'Id');
     				resolve(sorted[sorted.length - 1].Id);
     			} else {
     				resolve(null);	
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
     			resolve(json.Stops);
     		});
		})
	})
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}