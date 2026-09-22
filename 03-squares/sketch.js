//Square moving around edge of screen

let speed = 10;
let squareSize = 300;
let x;
let y;
let side;
async function setup() {
  createCanvas(windowWidth, windowHeight);

  x = 0;
  y = 0;
  side = "top";
}

function draw() {
  background(255);
  move();
  display();
}

function move() {
  if (side === "top") {
    x += speed;
    if (x>= width - squareSize) {
      side = "right";
    }
  }
  else if (side === "right") {
    y += speed;
    if (y>= height - squareSize) {
      side = "bottom";
    }
  }
  else if (side === "bottom") {
    x -= speed;
    if (x<= width - squareSize) {
      side = "left";
    }
  }
  else if (side === "left") {
    y -= speed;
    if (y>= height - squareSize) {
      side = "top";
    }
  }

}

function display() {
  fill(0);
  rect(x, y, squareSize, squareSize);
}