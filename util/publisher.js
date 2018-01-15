var amqp = require("amqplib/callback_api");
var dotenv = require("dotenv");

dotenv.load();

var amqpConn = null;
var pubChannel = null;
const CLOUDAMQP_URL = process.env.CLOUDAMQP_URL

// connect to amqp cloud
function connectToAmqp() {
	amqp.connect(CLOUDAMQP_URL + "?heartbeat=60", function(err, conn) {
		if(err) {
			console.error("[AMQP Connection error]", err.message);
			return setTimeout(connectToAmqp, 1000);
		}

		// if there is an error connecting
		conn.on('error', function(err) {
			if(err.message.toLowerCase() == "Connection Closing") {
				console.log("[AMQP Connection error]", err.message);
			}
		});

		conn.on("close", function() {
			console.log("[AMQP] reconnecting...");
			return setTimeout(connectToAmqp, 1000);
		});

		console.log("[AMQP] connected");
		amqpConn = conn;
		whenConnected();
	});
}

function whenConnected() {
	startPublisher();
}

// start publisher
function startPublisher() {
	amqpConn.createConfirmChannel(function(err, ch){
		if(err) {
			console.error("[AMQP Error]", err);
			amqpConn.close();
		}
	
		ch.on("error", function(err){
			console.error("[AMQP Channel Error]", err);
		});	

		ch.on("close", function() {
			console.log("[AMQP] channel closed");
		});

		pubChannel = ch;
	});
}

// publish messages to the queue. Assumption: queues are already created using amqp manager panel
var publish = exports.publish = function(content) {
	try {
		var exchange = "smartcoder";

		// if event is created, push data into project.created queue, otherwise push it to project.updated queue
		var routingKey = content.event == 'updated' ? "project.updated" : "project.created";
	
		content = new Buffer(JSON.stringify(content));

		pubChannel.publish(exchange, routingKey, content, { persistent: true },
                      function(err) {
                        if (err) {
                          console.error("[AMQP] publish ", err);
                          pubChannel.connection.close();
                        }

                        console.log(content.toString() + ' published to ' + routingKey);
                      });
	}
	catch(e) {
		console.error("[AMQP] error", e.message);
	}
}


connectToAmqp();
