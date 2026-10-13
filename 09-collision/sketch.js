// Collision Demo

let hit = false;
let rectColor;
let circleColor;
async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectColor = 'red';
  circleColor = 'white';
}

function draw() {
  background(220);

  hit = collideRectCircle(300, 400, 200, 150, mouseX, mouseY, 100);

  fill(rectColor);
  rect(300, 400, 200, 150);
  fill(circleColor);
  circle(mouseX, mouseY, 100);
  if (hit) {
    circleColor = 'red';
    rectColor = 'white';
    fill('black');
    text('Japan!', width * 3/4, height/2, 1000, 1000);
  }
  else {
    rectColor = 'red';
    circleColor = 'white';
  }
}
