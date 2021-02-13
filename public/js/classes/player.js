class Player {
    constructor(id, x, y) {
        this.id = id;
        this.position = createVector(x, y);
        this.size = 10;
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
        if (surroundingPixels[1][0] === 0) { // wall to north
            if (currentHeading < 0) { // can't go this way
                y = 0;
            }
        }
        if (surroundingPixels[3][0] === 0) { // wall to west
            if (currentHeading < -90 || currentHeading > 90) { // can't go this way
                x = 0;
            }
        }
        if (surroundingPixels[5][0] === 0) { // wall to east
            if (currentHeading > -90 < currentHeading < 90) { // can't go this way
                x = 0;
            }
        }
        if (surroundingPixels[7][0] === 0) { // wall to south
            if (currentHeading > 0) { // can't go this way
                y = 0;
            }
        }

        correctedVelocity.set(x, y);
        return correctedVelocity;

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