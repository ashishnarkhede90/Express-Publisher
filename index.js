var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var dotenv = require('dotenv');

dotenv.load();
var dbUtil = require('./util/dbutil');

// routes
var home = require('./routes/home');
var routes = require('./routes/project');

var app = express(); // instance of an express app

/* ==================  Middleware start ==================*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next) {
	console.log(`${req.method} for ${req.url} -- ${JSON.stringify(req.body)}`);
	next();
});

app.use(express.static('./public'));

app.use(cors());

// put routes to use
app.use('/v1/projects', routes);
app.use('/v1', home);

// if no route is matched
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.Status = 404;
	next(err);
});

/* ==================  Middleware end ==================*/

app.set('port', process.env.PORT || 9000);

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port'));
});

dbUtil.connectToDb();
