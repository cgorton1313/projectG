let players = [];

function handlePlayer(socket, io) {
    players.push(new Player(socket.id));
    io.sockets.emit('message', players);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('moved',
        function (data) {
            // Data comes in as whatever was sent, including objects
            //console.log("Received: 'mouse' " + data.x + " " + data.y);

            // Send it to all other clients
            socket.broadcast.emit('mouse', data);

            // This is a way to send to everyone including sender
            // io.sockets.emit('message', "this goes to everyone");
        }
    );

    socket.on('disconnect', function () {
        removePlayer(this.id);
        io.sockets.emit('message', players);
    });
}

function removePlayer(id) {
    for (let i = players.length - 1; i >= 0; i--) {
        if (players[i].id === id) {
            players.splice(i, 1);
        }
    }
}

function movePlayer() {

}

class Player {
    constructor(id) {
        this.id = id;
        console.log(`Player Id ${id} created`);
    }
}

module.exports = {handlePlayer}