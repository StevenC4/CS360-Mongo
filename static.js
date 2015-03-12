var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html";
var DATA_DIR = "data";
http.createServer(function(req, res){
	var urlObj = url.parse(req.url, true, false);
	if (urlObj.pathname.indexOf("getcity") != -1) {
		console.log("In REST Service");
		fs.readFile(DATA_DIR + "/cities.dat.txt", function(err, data){
			if (err) throw err;
			cities = data.toString().split("\n");
			var regex = new RegExp("^"+urlObj.query["q"]);
			var jsonResult = [];
			for (var i = 0; i < cities.length; i++) {
				var result = cities[i].search(regex)
				if (result != -1) {
					console.log(cities[i]);
					jsonResult.push({city:cities[i]});
				}
			}
			console.log(jsonResult);
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(JSON.stringify(jsonResult));
		});
	} else if (urlObj.pathname.indexOf(".html") == -1 && urlObj.pathname.indexOf(".css") == -1 && urlObj.pathname.indexOf(".js") == -1 && urlObj.pathname.indexOf("comments") != -1) {
          if (req.method.toUpperCase() === "POST") {
            var jsonData = "";
            req.on('data', function(chunk){
              jsonData += chunk;
            });
            req.on('end', function(){
              var reqObj = JSON.parse(jsonData);
              MongoClient.connect("mongodb://localhost/comments", function(err, db){
                if (err) {
                  res.writeHead(500);
                  res.end("Error connecting to the database");
                } else {
                  db.collection('comments').insert(reqObj, function(err, records){
                    if (err) {
                      res.writeHead(500);
                      res.end("Error writing to the collection");
                    } else {
                      res.writeHead(200);
                      res.end();
                    }
                  });
                }
              });
            });
          } else if (req.method.toUpperCase() === "GET") {
            MongoClient.connect("mongodb://localhost/comments", function(err, db){
              if (err) {
                res.writeHead(500);
                res.end("Error connecting to database");
              } else {
                db.collection("comments").find(function(err, items){
                  if (err) {
                    res.writeHead(500);
                    res.end("Error querying the collection");
                  } else {
                    items.toArray(function(err, itemArr){
                      if (err) {
                        res.writeHead(500);
                        res.end("Error casting result to array");                        
                      } else {
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(JSON.stringify(itemArr));
                      }
                    });
                  }
                });
              }
            });
          } else {
            res.writeHead(405);
            res.end("Method '" + req.method + "' not allowed");
          }
        }  else {
		fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data){
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			
			if (urlObj.pathname.indexOf(".js") != -1) {
				res.writeHead(200, {"Content-Type": "text/javascript"});
			} else if (urlObj.pathname.indexOf(".css") != -1) {
				res.writeHead(200, {"Content-Type": "text/css"});
			} else if (urlObj.pathname.indexOf(".html") != -1) {
				res.writeHead(200, {"Content-Type": "text/html"});
			} else if (urlObj.pathname.indexOf(".jpg") != -1) {
				res.writeHead(200, {"Content-Type": "image/jpeg"});
			} else if (urlObj.pathname.indexOf(".gif") != -1) {
				res.writeHead(200, {"Content-Type": "image/gif"});
			} else {
				res.writeHead(200);
			}
			res.end(data);
		});
	}
}).listen(80);

var options = {
	hostname: 'localhost',
	port: '80',
	path: '/hello.html'
};
function handleResponse(response) {
	var serverData = '';
	response.on('data', function(chunk) {
		serverData += chunk;
	});
	response.on('end', function() {
		console.log(serverData);
	});
}
http.request(options, function(response){
	handleResponse(response);
}).end();
