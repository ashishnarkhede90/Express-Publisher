var express = require('express');
var router = express.Router();

// route for home page
router.get('/', function(req, res) {

	res.send(`
		<head><title>Smartcoder</title></head>
		<h1>Welcome to Smartcoder</h1>
	`);
});

// route for services page
router.get('/services', function(req, res) {

	res.send(`
		<h2>Our Services</h2>
	`);
});

// route for feedback page
router.get('/contact', function(req, res) {

	res.send(`
		<h2>Contact us</h2>
	`);
});



module.exports = router;