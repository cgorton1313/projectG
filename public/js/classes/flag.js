class FlagArea {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = flagAreaSize;
    this.hasFlag = true;
  }
  isWithinArea(position) {
    let x = this.x;
    let y = this.y;
    let s = this.size / 2;
    if (position.x > x - s && position.x < x + s && position.y > y - s && position.y < y + s) {
      return true;
    }
    return false;
  }
  show() {
    noFill();
    stroke('white');
    strokeWeight(4);
    rectMode(CENTER);
    square(this.x, this.y, this.size);
  }
}

class Flag {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = 20;
  }
  show() {
    stroke('black');
    strokeWeight(2);
    line(this.x, this.y, this.x, this.y - this.height);
    fill('teal');
    rectMode(CORNER);
    rect(this.x, this.y - this.height, 0.5 * this.height, 0.4 * this.height);
  }
}