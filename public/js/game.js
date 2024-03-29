const showZoom = false;
const field = { width: 2560, height: 1280 };
const playerSize = 10;
const maxSpeed = 4; // not to exceed 1/2 player size
const flagAreaSize = 80;
const flagSlowdownFactor = 0.9;
let socket;
let myPlayer;
let otherPlayers = [];
let playerList; // the html div
let fieldImg;
let leftFlagArea, rightFlagArea;
let leftFlag, rightFlag;

function preload() {
    fieldImg = loadImage('images/field.png');
}

function setup() {
    angleMode(DEGREES);

    let htmlBody = select('body');
    let canvas = createCanvas(windowWidth, windowHeight - 8);
    canvas.parent(htmlBody);
    print(`window size is: ${width} x ${height}`);

    leftFlagArea = new FlagArea(1.5 * flagAreaSize, random(1.5 * flagAreaSize, field.height - (1.5 * flagAreaSize)));
    rightFlagArea = new FlagArea(field.width - (1.5 * flagAreaSize), random(1.5 * flagAreaSize, field.height - (1.5 * flagAreaSize)));
    leftFlag = new Flag(leftFlagArea.x, leftFlagArea.y, 'left');
    rightFlag = new Flag(rightFlagArea.x, rightFlagArea.y, 'right');

    socket = io();
    console.log(window.location.href);
    socket.connect();
    // socket.connect('https://cs.penguinhall.org/cgorton/projectG/socket.io');
    //socket.connect('https://cs.penguinhall.org', {path: "/cgorton/projectG/socket.io"});

    // socket.on('connect', function () {
    //     myPlayer = new Player(socket.id, field.width / 2, field.height / 2, 'right');
    //     updateDatePlayerList(otherPlayers);
    // });

    socket.on('myTeamAssignment',
        function (assignment) {
            myPlayer = new Player(socket.id, field.width / 2, field.height / 2, assignment);
            socket.emit('newPlayer', { id: myPlayer.id, x: myPlayer.position.x, y: myPlayer.position.y, team: myPlayer.team }); // announce my arrival!
        }
    );

    socket.on('addPlayer',
        function (player) {
            otherPlayers.push(new OtherPlayer(player.id, player.x, player.y, player.team));
            updateDatePlayerList(otherPlayers);
        }
    );

    socket.on('playerList',
        // I just joined and need the list of other players
        function (players) {
            for (let player of players) {
                otherPlayers.push(new OtherPlayer(player.id, player.x, player.y, player.team));
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

    socket.on('flagPosition',
        function (flagData) {
            if (flagData.team === 'right') {
                rightFlag.x = flagData.x;
                rightFlag.y = flagData.y;
            } else {
                leftFlag.x = flagData.x;
                leftFlag.y = flagData.y; 
            }
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
    leftFlagArea.show();
    rightFlagArea.show();
    leftFlag.show();
    rightFlag.show();

    if (myPlayer && myPlayer.team) {
        myPlayer.update();
        socket.emit('moved', { id: myPlayer.id, x: myPlayer.position.x, y: myPlayer.position.y });
        myPlayer.show();
        if (myPlayer.flag) {
            socket.emit('flagPosition', { team: myPlayer.flag.team, x: myPlayer.flag.x, y: myPlayer.flag.y });
        }
        camera.position.x = myPlayer.position.x;
        camera.position.y = myPlayer.position.y;

        if (showZoom) drawPixelView();
    }

    for (let otherPlayer of otherPlayers) {
        otherPlayer.show();
    }
}

function drawPixelView() {
    let radius = playerSize / 2;
    for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
            let pixel = fieldImg.get(camera.position.x + x, camera.position.y + y);
            fill(pixel[0], pixel[1], pixel[2]);
            square(camera.position.x + 200 + (x * 20), camera.position.y - 200 + (y * 20), 20);
        }
    }
    noFill();
    stroke('red');
    circle(camera.position.x + 200, camera.position.y - 200, 20 * playerSize);
}

function updateDatePlayerList(players) {
    let html = 'Me: ' + myPlayer.id + ' - ' + myPlayer.team + '<br><br>';
    html += 'Other Players: <br>';
    for (let player of players) {
        html += player.id + ' - ' + player.team + '<br>';
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
    rectMode(CORNER);
    rect(0, 0, w, h);
    image(fieldImg, 0, 0);
}