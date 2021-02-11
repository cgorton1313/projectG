class Player {
    constructor(id, x, y) {
        this.id = id;
        this.position = createVector(x, y);
        this.size = 10;
        this.color = 'green';
    }
    update() {
        let heading = createVector(camera.mouseX - this.position.x, camera.mouseY - this.position.y);
        heading.setMag(2);
        this.position.add(heading);
        this.position.x = constrain(this.position.x, 0, field.width);
        this.position.y = constrain(this.position.y, 0, field.height);
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