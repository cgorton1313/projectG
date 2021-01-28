let players = [];

function handlePlayer(socket, io) {

    socket.on('newPlayer',
        function (player) {
            // send player list to this new player
            socket.emit('playerList', players);

            let newPlayer = new Player(player.id, player.x, player.y);
            players.push(newPlayer);
            console.log(`Player Id ${newPlayer.id} created at x: ${newPlayer.x} | y: ${newPlayer.y} --- ${players.length} players in the game.`);

            // Broadcast all players to everyone
            socket.broadcast.emit('addPlayer', newPlayer);
        });

    socket.on('moved',
        function (playerData) {
            // Send it to all other clients
            socket.broadcast.emit('moved', playerData);
        }
    );

    socket.on('disconnect', function () {
        // Broadcast all players to everyone
        io.sockets.emit('removePlayer', this.id);
        removePlayer(this.id); // on server
        console.log(`Player Id ${this.id} removed --- ${players.length} players remaining.`);
    });
}

function removePlayer(id) {
    for (let i = players.length - 1; i >= 0; i--) {
        if (players[i].id === id) {
            players.splice(i, 1);
        }
    }
}

class Player {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}

module.exports = { handlePlayer }