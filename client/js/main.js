var socket = io.connect('http://ec2-54-201-18-251.us-west-2.compute.amazonaws.com');

$("#chat-input").keydown(function(e) {
	if(e.which == 13) {
		send();
	}
});

function send() {
	var chat = $("#chat-input").val();

	makeChat("Me", chat);

  socket.emit('chat', chat);

	$("#chat-input").val('');
}

function makeChat(who, chat) {
  var div = $("<div>");
  div.text(who + ": " + chat);

  $('.chats').append(div);
}


socket.on('chatted', function (data) {
	makeChat(data.user, data.chat);
  console.log(data);
});

socket.on('users', function (data) {
  console.log(data);
})

function changeName() {
  var user = prompt("Enter Name: ");
  
  if(user) {
    socket.emit('change name', user);
  } 
}
