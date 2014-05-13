var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat',function(err, db){
	
	if(err){throw err;}


	client.on('connection',function(socket){
		console.log('conected');
		
		var col = db.collection('messages');
		var sendStatus = function(s){
			socket.emit('status',s);
		};

		//Emit all messages
		col.find().limit(100).sort({_id:1}).toArray(function(err,res){
			if(err){throw err;}
			socket.emit('output',res);
		});


		//wait for input
		socket.on('input',function(data){
			var name = data.name;
			var message = data.message;
			whitespacePattern = /^\s*$/;

			if (whitespacePattern.test(name) || whitespacePattern.test(message)){
				sendStatus('Name and message is required.');
			} else{
				
			col.insert({name: name, message: message}, function(){

					//emit latest message to ALL clients
					client.emit('output',[data]);

					sendStatus({
						message: 'Message sent',
						clear: true
					});
				});
			}

			

		});
	});
	
});