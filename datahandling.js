
			(function(){
				var getNode = function(s){
					return document.querySelector(s);
				};
				// Get required nodes!
				messages = getNode('.chatMessages');
				textarea = getNode('.chatTextarea');
				chatName = getNode('.chatName');
				statusDefault = document.getElementById('span').textContent;
				


				setStatus = function(string){
					document.getElementById('span').textContent = string;
					if(string !== statusDefault){
						var delay = setTimeout(function(){
							setStatus(statusDefault);
							clearInterval(delay);
						},3000);
					}

				};


				try{
					var socket = io.connect('http://127.0.0.1:8080');
				}
				catch(err){
					//Set status to warn user
				}

				if(socket !== undefined){

					//listen for output
					socket.on('output',function(data){
						if(data.length){
							//loop through results
							for(var i = 0; i<data.length; i++){
								var message = document.createElement('div');
								message.setAttribute('class', 'chatMessage');
								message.textContent= data[i].name +' : ' + data[i].message;

								//append to messages container

								messages.appendChild(message);
								messages.insertBefore(message, messages.firstChild);

							}
						}
					});


					//listen for status
					socket.on('status',function(data){
						setStatus((typeof data ==='object') ? data.message: data);
						if(data.clear=== true){
							textarea.value = '';
						}

					});



					// Listen for keydown
					textarea.addEventListener('keydown', function(event){
						var self = this;
						var name = chatName.value;

						// console.log(event);
						if(event.which===13 && event.shiftKey === false){
							socket.emit('input',{
								name : name,
								message: self.value
							})
						}
					});
				}
				//event.preventDefault();
			})();
		