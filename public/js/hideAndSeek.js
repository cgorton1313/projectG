let socket;
let otherPlayers = [];
let playerList; // the div
let myPlayer;

function setup() {

    createCanvas(400, 400);
    socket = io.connect('http://localhost:4444');
    socket.on('connect', function () {
        myPlayer = new Player(socket.id);
        updateDatePlayerList(otherPlayers);
        socket.emit('newPlayer', { id: myPlayer.id, x: myPlayer.x, y: myPlayer.y });
    });

    socket.on('addPlayer',
        // When a player joins
        function (player) {
            otherPlayers.push(new OtherPlayer(player.id, player.x, player.y));
            updateDatePlayerList(otherPlayers);
        }
    );

    socket.on('playerList',
        // I joined and need the other players
        function (players) {
            for (let player of players) {
                otherPlayers.push(new OtherPlayer(player.id, player.x, player.y));
            }
            updateDatePlayerList(otherPlayers);
        }
    );

    socket.on('removePlayer',
        // remove this player
        function (id) {
            for (let i = otherPlayers.length - 1; i >= 0; i--) {
                if (otherPlayers[i].id === id) {
                    otherPlayers.splice(i, 1);
                }
            }
            updateDatePlayerList(otherPlayers);
        }
    );

    socket.on('moved',
        // When some player moves
        function (playerData) {
            for (let otherPlayer of otherPlayers) {
                if (playerData.id === otherPlayer.id) {
                    print('checking ' + playerData);
                    otherPlayer.x = playerData.x;
                    otherPlayer.y = playerData.y;
                }
            }
        }
    );

    playerList = createDiv().position(20, 20);
}

function draw() {
    background(100);

    if (myPlayer) {
        myPlayer.show();
    }

    for (let otherPlayer of otherPlayers) {
        otherPlayer.show();
    }
}

function mouseMoved() {
    if (myPlayer) {
        myPlayer.update();
    }
}

function updateDatePlayerList(players) {
    let html = 'Me: ' + myPlayer.id + '<br><br>';
    html += 'Other Players: <br>';
    for (let player of players) {
        html += player.id + '<br>';
    }
    playerList.html(html);
}

class Player {
    constructor(id) {
        this.id = id;
        this.x = width / 2;
        this.y = height / 2;
        this.size = 10;
        this.color = 'green';
    }
    update() {
        this.x = constrain(mouseX, 100, width - 100);
        this.y = constrain(mouseY, 100, height - 100);
        socket.emit('moved', { id: this.id, x: this.x, y: this.y });
    }
    show() {
        fill(this.color);
        strokeWeight(2);
        stroke('black');
        circle(this.x, this.y, this.size);
    }
}

class OtherPlayer {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = 10;
        this.color = 'red';
    }
    show() {
        fill(this.color);
        strokeWeight(2);
        stroke('black');
        circle(this.x, this.y, this.size);
    }
}