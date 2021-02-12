class Player {
    constructor(id, x, y) {
        this.id = id;
        this.position = createVector(x, y);
        this.size = 10;
        this.color = 'green';
    }
    update() {
        let heading = createVector(camera.mouseX - this.position.x, camera.mouseY - this.position.y);
        heading.setMag(constrain(heading.mag() / 10, 0, 4)); // scale speed

        if (this.canMove()) {
            this.position.add(heading);
        }
        
        this.position.x = constrain(this.position.x, 0, field.width);
        this.position.y = constrain(this.position.y, 0, field.height);
        socket.emit('moved', { id: this.id, x: this.position.x, y: this.position.y });
    }
    canMove() {
        let surroundingPixels = this.getSurroundingPixels(this.position.x, this.position.y);

        for (let pixel of surroundingPixels) {
            if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0) {
                print('hit wall');
                return false;
            }
        }

        return true;
    }
    getSurroundingPixels(x, y) {
        let pixels = [];

        // above
        pixels.push(fieldImg.get(x - 1, y - 1));
        pixels.push(fieldImg.get(x, y - 1));
        pixels.push(fieldImg.get(x + 1, y - 1));
        // in line
        pixels.push(fieldImg.get(x - 1, y));
        pixels.push(fieldImg.get(x, y));
        pixels.push(fieldImg.get(x + 1, y));
        // below
        pixels.push(fieldImg.get(x - 1, y + 1));
        pixels.push(fieldImg.get(x, y + 1));
        pixels.push(fieldImg.get(x + 1, y + 1));

        return pixels;
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