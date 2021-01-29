let socket;
let myPlayer;
let otherPlayers = [];
let playerList; // the html div

function setup() {
    let canvasDiv = select('#canvasDiv');
    let canvasDivHeight = select('body').height - (select('header').height + select('footer').height);
    let canvas = createCanvas(canvasDiv.width, canvasDivHeight);
    canvas.parent('#canvasDiv');

    socket = io.connect('http://localhost:4444');

    socket.on('connect', function () { // still like to know why socket is undefined
        myPlayer = new Player(socket.id);
        updateDatePlayerList(otherPlayers);
        socket.emit('newPlayer', { id: myPlayer.id, x: myPlayer.x, y: myPlayer.y }); // announce my arrival!
    });

    socket.on('addPlayer',
        function (player) {
            otherPlayers.push(new OtherPlayer(player.id, player.x, player.y));
            updateDatePlayerList(otherPlayers);
        }
    );

    socket.on('playerList',
        // I just joined and need the list of other players
        function (players) {
            for (let player of players) {
                otherPlayers.push(new OtherPlayer(player.id, player.x, player.y));
            }
            updateDatePlayerList(otherPlayers);
        }
    );

    socket.on('removePlayer',
        function (id) {
            for (let i = otherPlayers.length - 1; i >= 0; i--) {
                if (otherPlayers[i].id === id) {
                    otherPlayers.splice(i, 1); // should we return here? after updating list?
                }
            }
            updateDatePlayerList(otherPlayers);
        }
    );

    socket.on('moved',
        // When a player moves
        function (playerData) {
            // TODO: find a more efficient way of getting the player, or return
            for (let otherPlayer of otherPlayers) {
                if (playerData.id === otherPlayer.id) {
                    otherPlayer.x = playerData.x;
                    otherPlayer.y = playerData.y;
                }
            }
        }
    );

    // The HTML div that holds the list
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