class Player {
    constructor(id, x, y, team) {
        this.id = id;
        this.position = createVector(x, y);
        this.size = playerSize;
        this.team = team;
        this.color = (team === 'left') ? 'green' : 'purple';
    }
    update() {
        let velocity = createVector(camera.mouseX - this.position.x, camera.mouseY - this.position.y);
        velocity.setMag(constrain(velocity.mag() / 10, 0, maxSpeed)); // scale speed

        let limitedHeading = this.limitHeading(velocity);
        
        // show down if carrying flag
        if (this.flag) {
            limitedHeading.setMag(limitedHeading.mag() * flagSlowdownFactor);
        }

        this.position.add(limitedHeading); // update position

        this.position.x = constrain(this.position.x, 0, field.width);
        this.position.y = constrain(this.position.y, 0, field.height);
    
        let flagToCheck = (this.team === 'right') ? leftFlag : rightFlag;
        this.checkFlagGrab(flagToCheck);
        if (this.flag) {
            this.flag.x = this.position.x;
            this.flag.y = this.position.y;
            let flagAreaToCheck = (this.team === 'right') ? rightFlagArea : leftFlagArea;
            this.checkFlagReturn(flagAreaToCheck);
        }
    }
    checkFlagReturn(flagArea) {
        if (flagArea.isWithinArea(this.position)) {
            // score a point

            // return flag
            if (this.team === 'right') {
                leftFlag.x = leftFlagArea.x;
                leftFlag.y = leftFlagArea.y;
            } else {
                rightFlag.x = rightFlagArea.x;
                rightFlag.y = rightFlagArea.y;
            }
            this.flag = null;
        }
    }
    checkFlagGrab(flag) {
        let d = dist(this.position.x, this.position.y, flag.x, flag.y);
        if (d < this.size) {
            this.flag = (this.team === 'right') ? leftFlag : rightFlag;
            // emit 'flagGrabbed' + id
        }
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
        stroke(255, 255, 255, 50);
        noFill();
        circle(this.position.x, this.position.y, this.size * 2); // halo
    }
}