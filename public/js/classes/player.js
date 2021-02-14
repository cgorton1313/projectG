class Player {
    constructor(id, x, y) {
        this.id = id;
        this.position = createVector(x, y);
        this.size = playerSize;
        this.color = 'green';
    }
    update() {
        let heading = createVector(camera.mouseX - this.position.x, camera.mouseY - this.position.y);
        heading.setMag(constrain(heading.mag() / 10, 0, maxSpeed)); // scale speed

        let limitedHeading = this.limitHeading(heading);
        this.position.add(limitedHeading);

        this.position.x = constrain(this.position.x, 0, field.width);
        this.position.y = constrain(this.position.y, 0, field.height);
        socket.emit('moved', { id: this.id, x: this.position.x, y: this.position.y });
    }
    limitHeading(velocity) { // returns heading in degrees that player can move
        let correctedVelocity = velocity.copy();
        let currentHeading = velocity.heading();
        let surroundingPixels = this.getSurroundingPixels(this.position.x, this.position.y);
        // TODO: this only checks the red color is 0, should check g and b
        let x = velocity.x;
        let y = velocity.y;
        if (this.isWall(surroundingPixels[0])) { // wall to north
            y = (currentHeading < 0) ? 0 : y;
        }
        if (this.isWall(surroundingPixels[3])) { // wall to west
            x = (currentHeading < -90 || currentHeading > 90) ? 0 : x;
        }
        if (this.isWall(surroundingPixels[1])) { // wall to east
            x = (currentHeading > -90 && currentHeading < 90) ? 0 : x;
        }
        if (this.isWall(surroundingPixels[2])) { // wall to south
            y = (currentHeading > 0) ? 0 : y;
        }

        correctedVelocity.set(x, y);
        return correctedVelocity;
    }
    isWall(pixel) {
        return (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0);
    }
    getSurroundingPixels(x, y) {
        let pixels = [];
        let radius = this.size / 2;
        
        pixels.push(fieldImg.get(x, y - radius)); // north
        pixels.push(fieldImg.get(x + radius, y)); // east
        pixels.push(fieldImg.get(x, y + radius)); // south
        pixels.push(fieldImg.get(x - radius, y)); // west

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