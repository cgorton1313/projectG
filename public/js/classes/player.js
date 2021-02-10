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