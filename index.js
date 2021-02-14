const config = require(__dirname + '/config.js');
const player = require(__dirname + '/serverPlayer.js');
const express = require('express');
const app = express();

// start the app
const server = app.listen(config.app.port, () => {
    console.log(`projectG server listening on port ${config.app.port}`);
});

// serve the /public files
app.use(express.static('public'));

// web sockets
const socket = require('socket.io');
const io = socket(server);

// register a callback function to run when we have an individual connection
// this is run for each individual user that connects
io.sockets.on('connection', function (socket) {  
    player.handlePlayer(socket, io);
});
