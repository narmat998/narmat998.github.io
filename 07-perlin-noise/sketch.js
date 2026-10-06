// Perlin noise demo

let timeX = 0;
let timeY = 0;
let deltaTimeX = 0.01;
let deltaTimeY = 0.008;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  //background(220);
  let x = noise(timeX) * width;
  let y = noise(timeY) * height;
  fill('black');
  circle(x, y, 2);
  
  timeX += deltaTimeX;
  timeY += deltaTimeY;
}
  
