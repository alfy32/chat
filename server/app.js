/* jshint node:true */
'use strict';

var express = require('express');
var http    = require('http');
var fs      = require('fs');

var app = express();

app.set('port', process.env.PORT || process.argv[2] || 3006);

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static('client'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// fs.readdirSync(__dirname + '/routes').forEach(function (file) {
//   require('./routes/' + file)(app);
// });

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

var users = {};
var userCount = 0;

var admin = {
  name: 'admin'
};

io.sockets.on('connection', function (socket) {
  var user = {
    name: "User #" + ++userCount,
    id: userCount
  };

  users[user.id] = user;

  socket.emit('users', users);

  socket.on('chat', function (data) {
    var response = {
      user: user.name, 
      chat: data
    };

    socket.broadcast.emit('chatted', response);
    console.log(response);
  });

  socket.on('change name', function(data) {
    user.name = data;
  });

  socket.on('disconnect', function() {
    var chat = {
      user: admin.name, 
      chat: user.name + " has left."
    };

    socket.broadcast.emit('chatted', chat);

    delete users[user.id];
    console.log("gone*********************");
  });
});
