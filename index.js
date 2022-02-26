const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const collisionDetection = require('./src/collision.util');
const playerVelocity = 1;
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
  // a.get key press from client
  socket.on('gameplay', (msg) => {
    // console.log('  -> received keyPress = ', keyPress);
    // TODO: Create logic
    for (var i = 0; i < tanks.length; i++) {
      if(tanks[i].id === socket.id) {
        tanks[i].keyboardPress = msg.keyboardPress;
      }
    }
  });
  // b. push object position to client
  var intervalid = setInterval(() => {
    for (var i = 0; i < tanks.length; i++) {
      if(tanks[i].id === socket.id) {
        if(tanks[i].keyboardPress) {
          if (tanks[i].keyboardPress.upIsDown) {
            tanks[i].angle = 0;
            if(collisionDetection.check(socket.id, i, tanks[i].angle, playerVelocity,  tanks)) {
              tanks[i].y = tanks[i].y - playerVelocity;
            }
          } else if (tanks[i].keyboardPress.downIsDown) {
            tanks[i].angle = -180;
            if(collisionDetection.check(socket.id, i, tanks[i].angle, playerVelocity, tanks)) {
              tanks[i].y = tanks[i].y + playerVelocity;
            }
          } else if (tanks[i].keyboardPress.leftIsDown) {
            tanks[i].angle = -90;
            if(collisionDetection.check(socket.id, i, tanks[i].angle, playerVelocity, tanks)) {
              tanks[i].x = tanks[i].x - playerVelocity;
            }
          } else if (tanks[i].keyboardPress.rightIsDown) {
            tanks[i].angle = 90;
            if(collisionDetection.check(socket.id, i, tanks[i].angle, playerVelocity, tanks)) {
              tanks[i].x = tanks[i].x + playerVelocity;
            }
          }

          // stop tank run outside screen (1280 * 720 resolution)
          if (tanks[i].x < 8) tanks[i].x = 8;
          if (tanks[i].x > 1280 - 8 ) tanks[i].x = 1280 - 8;
          if (tanks[i].y < 8) tanks[i].y = 8;
          if (tanks[i].y > 720 - 8 ) tanks[i].y = 720 - 8;

        }
      }
    }
    io.emit('gameplay', {
      status: 1,
      info: 'success',
      tanks: tanks
    }); 
  }, 10); 
  

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