var mongoClient = require('mongodb').MongoClient;
var dbInstance;

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
	
	connectToDb() {
		if(!dbInstance) {
			mongoClient.connect(MONGODB_URI, function(err, db) {

				if(err) {
					console.error("[dberror] Error connecting to database: " + err);
				} 
				else {
					dbInstance = db;
					console.log('[db] Connected to db ');
				}
			});
		}
	},  

	findProjects(query, cb) {
		console.log( query);
		var db = dbInstance || this.connectToDb();

		db.collection('projects').find(query).toArray(function(err, project) {

			if(err) {
				console.log("[dberror] An error occurred while finding the document " + err);
				cb(err);
			}

			console.log("[db] Project: " + JSON.stringify(project));
			
			cb(null, project);
		});
	},

	// insert project data in the db
	insertProject(project, cb) {
		var db = dbInstance || this.connectToDb();
		
		db.collection('projects').insertOne(project, function(err, r) {

			console.log(r.ops[0]._id);
			if(err || r.insertedCount < 1) {
				console.error("[dberror] An error occurred inserting data: " + err || "");
				cb(err || new Error("Failed to insert project"));
			}

			console.log("[db] Project created: " + JSON.stringify(r));
			cb();
		});
	},

	// update existing project in the db
	updateProject(query, update, cb) {
		var db = dbInstance || this.connectToDb();

		// use findOneAndModify for update since the resulting doc is needed for processing
		db.collection('projects').findOneAndUpdate(query, update, {upsert: false, returnOriginal: false}, function(err, r) {

			if(err || r.lastErrorObject.n < 1) {
				console.error("[dberror] An error occurred updating data: " + err || "");
				cb(err, null);
			}
			else if(r.matchedCount) {
				console.log("[db] The requested document does not exist in the db");
				cb("Project does not exist", null);
			}
			
			console.log("[db] Project updated: " + JSON.stringify(r));
			cb(null, r.value);
		});
	},

	deleteProject() {
		var db = dbInstance || this.connectToDb();
	}
}
