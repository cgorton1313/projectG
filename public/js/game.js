let socket;
let myPlayer;
let otherPlayers = [];
let playerList; // the html div
const field = {width: 2560, height: 1280};
//
function setup() {
    let htmlBody = select('body');
    let canvas = createCanvas(windowWidth, windowHeight - 8);
    canvas.parent(htmlBody);
    print(`window size is: ${width} x ${height}`);

    socket = io();
    socket.connect('http://localhost:4444');
    
    socket.on('connect', function () { // still like to know why socket is undefined
        myPlayer = new Player(socket.id, field.width / 2, field.height / 2);
        updateDatePlayerList(otherPlayers);
        socket.emit('newPlayer', { id: myPlayer.id, x: myPlayer.position.x, y: myPlayer.position.y }); // announce my arrival!
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
    drawBackground(field.width, field.height);

    if (myPlayer) {
        myPlayer.update();
        myPlayer.show();
        camera.position.x = myPlayer.position.x;
        camera.position.y = myPlayer.position.y;
    }

    for (let otherPlayer of otherPlayers) {
        otherPlayer.show();
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

function drawBackground(w, h) {
    background(100);
    // draw lines
    strokeWeight(1);
    stroke(0, 40);
    for (let x = 0; x < w; x += w / 20) {
        line(x, 0, x, h);
    }
    for (let y = 0; y < h; y += h / 20) {
        line(0, y, w, y);
    }
    // draw border
    stroke(0);
    strokeWeight(8);
    noFill();
    rect(10, 10, w - 20, h - 20);
}