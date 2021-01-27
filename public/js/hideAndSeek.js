let socket;
let players = [];
let playerList;

function setup() {
    createCanvas(800, 600);
    socket = io.connect('http://localhost:4444');
    socket.on('message',
        // When we receive data
        function (data) {
            players = data;
        }
    );
    frameRate(1);
    playerList = createDiv('Players:');
    playerList.position(20, 20);
}

function draw() {
    background(100);

    updateDatePlayerList(players);
    print(players);
}

function mouseMoved() {
    //print(mouseX, mouseY);
    //socket.emit('moved',{x: mouseX, y: mouseY});
}

function updateDatePlayerList(players) {
    let html = 'Players: <br>';
    for (let player of players) {
        html += player.id + '<br>';
    }
    playerList.html(html);
}