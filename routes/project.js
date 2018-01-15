var express = require('express');
var router = express.Router();
var dbUtil = require('../util/dbutil');
var projectSchema = require('../schema');
var publisher = require('../util/publisher');
var identities = require('../data/identity');

// Mock the identity service i.e. logged in user
var index = Math.floor((Math.random() * 7) + 1);
var user = identities[0];

// route for project list
router.get('/all', function(req, res){ 
	
	dbUtil.findProjects({}, function(err, projects) {
		if(err) {
			res.json(err);
		}

		res.send(projects);
	});
});

// route for project search
router.get('/search', function(req, res) {
	console.log('req.query: ' + req.query);
	var tags = req.query.tags.split(',');
	var query = { 'tags': { $in: tags } };
	dbUtil.findProjects(query, function(err, projects) {
		if(err) {
			res.json(err);
		}

		res.send(projects);
	});
});

// route for project create
router.post('/', function(req, res) {
	var project = req.body;
	if(project) {

		dbUtil.insertProject(project, function(err) {
			if(err) {
				res.json(err);
			}

			var content = {
				'user': user, // logged in user
				'project': project,
				'event': 'created'
			}
			// send the project details to rabbitmq exchange
			publisher.publish(content);
			res.json("Project created successfully");
		});	
	}
});

// route for individual project detail
router.get('/:title', function(req, res) {

	var query = { 'title': req.params.title };

	dbUtil.findProjects(query, function(err, project) {
		if(err) {
			res.json(err);
		}

		res.send(project);
	});
});

// route for project update
router.put('/:title', function(req, res){

	var title = req.params.title;

	var query = { 'title': req.params.title };
	var update = { $set: req.body }; // req.body should only contain fields to update

	// use findOneAndModify for update since the resulting doc is needed for processing
	dbUtil.updateProject(query, update, function(err, project) {
		if(err) {
			res.json(err);
		}

		var content = {
			'user': user, // logged in user
			'project': project,
			'event': 'updated'
		}
		// send the project details to rabbitmq exchange
		publisher.publish(content);

		res.json("Project updated successfully");
	});

	//res.redirect(`/project/${pId}`);
});

// route for project faqs
router.get('/:id/faqs', function() {
	
});

module.exports = router;