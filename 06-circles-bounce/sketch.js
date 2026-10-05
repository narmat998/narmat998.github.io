// Object notation and arrays demo
// bouncing circles
let theCircles = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(220);
  for (let theCircle of theCircles) {
    //move circle
    theCircle.x += theCircle.dx;
    theCircle.y += theCircle.dy;

    //bounc edges
    if (theCircle.x <=0 + theCircle.radius || theCircle.x >= width + theCircle.radius) {
      theCircle.dx *= -1;
    }
    if (theCircle.y <=0 + theCircle.radius || theCircle.y >= height + theCircle.radius) {
      theCircle.dy *= -1;
    }
    fill(theCircle.r, theCircle.g, theCircle.b);
    circle(theCircle.x, theCircle.y, theCircle.radius);
  }
}
function mousePressed() {
  spawnCircle();
}

function spawnCircle() {
  let someCircle = {
    x: mouseX,
    y: mouseY,
    dx: random(-10, 10),
    dy: random(-10, 10),
    radius: random(10, 50),
    r: random(255),
    g: random(255),
    b: random(255),
  };
  theCircles.push(someCircle);
}