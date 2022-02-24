const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var tanks = [];

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

io.on('connection', (socket) => {
  var personName = '';
  console.log('a user connected. socket.id = ', socket.id);

  

  // initial newlly connected player.
  socket.on('player user name', (msgObj) => {
    if (msgObj.personName) {
      personName = msgObj.personName;
      tanks.push({
        id: socket.id,
        personName: msgObj.personName,
        x: 8 + 64 * tanks.length, // TODO: 
        y: 500, // TODO: 
        angle: 90 // TODO: 
      });
      io.emit('gameplay', {
        status: 1,
        info: 'success',
        tanks: tanks
      });
    }
  });

  // game play logic
  socket.on('gameplay', (keyPress) => {
    // console.log('  -> received keyPress = ', keyPress);
    // TODO: Create logic
  });

  

  // broadcast to all connected sockets
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });


  // disconnect
  socket.on('disconnect', () => {
    console.log(`user ${personName} (id = ${socket.id}) disconnected`);
    for (var i = 0; i < tanks.length; i++) {
      if(tanks[i].id === socket.id) {
        tanks.splice(i, 1);
      }
    }
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