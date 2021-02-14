class OtherPlayer {
    constructor(id, x, y, team) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = 10;
        this.team = team;
        this.color = (team === 'right') ? 'purple': 'green';
    }
    show() {
        fill(this.color);
        strokeWeight(2);
        stroke('black');
        circle(this.x, this.y, this.size);
    }
}