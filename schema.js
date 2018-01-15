var util = require('util');
var eventEmitter = require('events').EventEmitter;

var project = module.exports = function(projectDetails) {

	this.title			= 	projectDetails.title;
	this.description	= 	projectDetails.description;
	this.launchdate		= 	projectDetails.launchdate;
	this.submissiondate	= 	projectDetails.submissiondate;
	this.datecreated	= 	projectDetails.datecreated;
	this.createdby		= 	projectDetails.createdby;
	this.dateupdated	= 	projectDetails.dateupdated;
	this.updatedby		= 	projectDetails.updatedby;
	this.terms 			= 	projectDetails.terms;
	this.status 		= 	projectDetails.status;
	this.first_prize	= 	projectDetails.first_prize;
	this.second_prize	= 	projectDetails.second_prize;
	this.third_prize	= 	projectDetails.third_prize;
	this.details = {
		features: [],
		platforms: [],
		technologies: [],
		github: '', // github link for code to get started
		external_links: [],
		attachments: [],
		tags: []
	};
	this.user = {
		firstname: '',
		lastname: '',
		email: ''
	}

	if(projectDetails.user) {
		this.details.features		= projectDetails.details.features;
		this.details.platforms  	= projectDetails.details.platforms;
		this.details.technologies 	= projectDetails.details.technologies;
		this.details.github 		= projectDetails.details.github;
		this.details.external_links = projectDetails.details.external_links;
		this.details.attachments 	= projectDetails.details.attachments;
		this.details.tags 			= projectDetails.details.tags; 	
	}

	if(projectDetails.user) {
		this.user.firstname = projectDetails.user.firstname;
		this.user.lastname = projectDetails.user.lastname;
		this.user.email = projectDetails.user.email;
	}

};


util.inherits(project, eventEmitter);