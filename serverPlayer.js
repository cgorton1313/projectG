let players = [];
let nextTeam = 'right'; // I hate to not use static class property but...

function handlePlayer(socket, io) {

    // flip the team assignment
    nextTeam = (nextTeam === 'right') ? 'left' : 'right';
    socket.emit('myTeamAssignment', nextTeam);

    socket.on('newPlayer',
        function (player) {
            // send player list to this new player
            socket.emit('playerList', players);
            let newPlayer = new Player(player.id, player.x, player.y, player.team);
            players.push(newPlayer);
            console.log(`Player Id ${newPlayer.id} created at x: ${newPlayer.x} | y: ${newPlayer.y} on team ${newPlayer.team} --- ${players.length} players in the game.`);

            // Broadcast all players to everyone
            socket.broadcast.emit('addPlayer', newPlayer);
        });

    socket.on('moved',
        function (playerData) {
            // Send it to all other clients
            socket.broadcast.emit('moved', playerData);
        }
    );

    socket.on('flagPosition',
        function (flagData) {
            // Send flag position to all other clients
            socket.broadcast.emit('flagPosition', flagData);
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
    constructor(id, x, y, team) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.team = team;
    }
}

module.exports = { handlePlayer }