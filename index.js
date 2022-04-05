const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const collisionDetection = require('./src/collision.util');
const FACE_UP_ANGLE = 0;
const FACE_DOWN_ANGLE = -180;
const FACE_LEFT_ANGLE = -90;
const FACE_RIGHT_ANGLE = 90;
const INTERVAL_MS = 8; // time interval in ms
const FIRE_ONCE_N_MS = 1000; // bullet delay (fire once per n ms)
const playerVelocity = 1;
const BULLET_VELOCITY = 2; // BULLET_VELOCITY
var tanks = [];

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

// socket connection start ===================================================>>>
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
        angle: 90, // TODO: 
        bullets: []
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
  var lastTime = new Date(); // test: check time spend inside Interval
  var interval_ID = setInterval(() => {
    // test: check time spend inside Interval ===============>
    var thisTime = new Date();
    var timeDelta = thisTime-lastTime;
    /// console.log("The average interval was "+timeDelta+" milliseconds");
    lastTime = thisTime;
    // end check <=================================


    for (var i = 0; i < tanks.length; i++) {
      if(tanks[i].id === socket.id) { // find user tank by socket id
        if(tanks[i].keyboardPress) {
          // Fire bullets
          if (tanks[i].keyboardPress.ctrlIsDown) {
            if (!tanks[i].bullets) {tanks[i].bullets = [];}
            // fire once per second
            if (
                tanks[i].bullets.length === 0 ||
                (
                  tanks[i].bullets[tanks[i].bullets.length-1] &&
                  thisTime - tanks[i].bullets[tanks[i].bullets.length-1].timeOfFire > FIRE_ONCE_N_MS
                )
            ) {
              // console.log(' fire ', tanks[i].bullets.length + 1 , ' times.');
              // TODO: 1. move bullets, 2. collision detection, explition, kill count.
              tanks[i].bullets.push({
                timeOfFire: thisTime,
                x: tanks[i].x,
                y: tanks[i].y,
                angle: tanks[i].angle,
              });
            }
          }

          // bullets fly away delta
          if (tanks[i].bullets && tanks[i].bullets.length) {
            for (var j = 0; j < tanks[i].bullets.length; j++) {
              var bullet = tanks[i].bullets[j];
              ////// bullet
              if (bullet.angle === FACE_UP_ANGLE) {
                bullet.y = bullet.y - BULLET_VELOCITY;
              }
              if (bullet.angle === FACE_DOWN_ANGLE) {
                bullet.y = bullet.y + BULLET_VELOCITY;
              }
              if (bullet.angle === FACE_LEFT_ANGLE) {
                bullet.x = bullet.x - BULLET_VELOCITY;
              }
              if (bullet.angle === FACE_RIGHT_ANGLE) {
                bullet.x = bullet.x + BULLET_VELOCITY;
              }
              
              // remove bullets if out of screen
              if (
                  bullet.x < -16 || bullet.x > 1300 ||
                  bullet.y < -16 || bullet.y > 740
                ) {
                tanks[i].bullets.splice(j, 1);
                // console.log('remove bullets from array. bullet at (', bullet.x, ',', bullet.y, ')');
              }
            }
          }
          

          // Drive direction
          if (tanks[i].keyboardPress.upIsDown) {
            tanks[i].angle = FACE_UP_ANGLE;
            if(!collisionDetection.checkTankAgainstTank(tanks, i, playerVelocity)) { // TODO: checkTankAgainstTank always return true at this moment. 
              tanks[i].y = tanks[i].y - playerVelocity;
            }
          } else if (tanks[i].keyboardPress.downIsDown) {
            tanks[i].angle = FACE_DOWN_ANGLE;
            if(!collisionDetection.checkTankAgainstTank(tanks, i, playerVelocity)) { // TODO: checkTankAgainstTank always return true at this moment.
              tanks[i].y = tanks[i].y + playerVelocity;
            }
          } else if (tanks[i].keyboardPress.leftIsDown) {
            tanks[i].angle = FACE_LEFT_ANGLE;
            if(!collisionDetection.checkTankAgainstTank(tanks, i, playerVelocity)) { // TODO: checkTankAgainstTank always return true at this moment.
              tanks[i].x = tanks[i].x - playerVelocity;
            }
          } else if (tanks[i].keyboardPress.rightIsDown) {
            tanks[i].angle = FACE_RIGHT_ANGLE;
            if(!collisionDetection.checkTankAgainstTank(tanks, i, playerVelocity)) { // TODO: checkTankAgainstTank always return true at this moment.
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

    
    socket.emit('gameplay', { // socket.emit send to current client, io.emit send to all clients, socket.broadcast.emit send to all listeners except the sender
      status: 1,
      info: 'success',
      tanks: tanks
    });
  }, INTERVAL_MS); 
  

  // broadcast to all connected sockets
  socket.on('chat message', (msg) => { // socket.emit send to current client, io.emit send to all clients, socket.broadcast.emit send to all listeners except the sender
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
    if(interval_ID) {
      clearInterval(interval_ID);
    }
  });
});
// socket connection end <<<<===================================================

/* 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
//*/

server.listen(3000, () => {
  console.log('listening on *:3000');
});