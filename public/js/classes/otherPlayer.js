class OtherPlayer {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = 10;
        this.color = 'red';
    }
    show() {
        fill(this.color);
        strokeWeight(2);
        stroke('black');
        circle(this.x, this.y, this.size);
    }
}