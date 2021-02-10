class Player {
    constructor(id) {
        this.id = id;
        this.position = createVector(fieldSize.x / 2, fieldSize.y / 2);
        this.size = 10;
        this.color = 'green';
    }
    update() {
        let heading = createVector(camera.mouseX - this.position.x, camera.mouseY - this.position.y);
        heading.setMag(2);
        this.position.add(heading);
        this.position.x = constrain(this.position.x, 0, fieldSize.x);
        this.position.y = constrain(this.position.y, 0, fieldSize.y);
        socket.emit('moved', { id: this.id, x: this.position.x, y: this.position.y });
    }
    show() {
        strokeWeight(2);
        stroke('black');
        line(this.position.x, this.position.y, camera.mouseX, camera.mouseY);
        fill(this.color);
        strokeWeight(2);
        stroke('black');
        circle(this.position.x, this.position.y, this.size);
    }
}