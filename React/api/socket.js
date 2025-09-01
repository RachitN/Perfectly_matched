const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('sendMessage', (message) => {
    console.log(message)
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(5001, () => {
  console.log('listening on *:5000');
});
