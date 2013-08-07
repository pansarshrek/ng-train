var express = require('express'),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose');
	
var mongoModels = require('./backendjs/models')(mongoose);
var api = require('./backendjs/api');

mongoose.connect('mongodb://localhost/ng-train');

var app = express();

app.configure(function() {
	var public_path = path.join(__dirname, 'public');
	app.use(express.static(public_path));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use(express.session({secret: "adsrjkter935_2)#F!"}));
	app.use(app.router);
});

api.createApi(app, mongoModels);

http.createServer(app).listen(8000, function() {
	console.log("Webserver started on port 8000!");
});