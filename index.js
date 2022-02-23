const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

io.on('connection', (socket) => {
  console.log('a user connected. socket.id = ', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // game play
  socket.on('gameplay', (msgObj) => {
    // io.emit('gameplay', msgObj);
    console.log('  -> server received = ', msgObj);
  });

  // broadcast to all connected sockets
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});


/* 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
//*/

server.listen(3000, () => {
  console.log('listening on *:3000');
});