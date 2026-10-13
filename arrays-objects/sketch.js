// Arrays and Object Notation Project/ Tanks
// Narayan Thibodeau
// October 7th, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//comment as you go so you dont lose your mind
let terrain = [];
const NUMBER_RECTS = 2000;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  generateTerrain();
}

function draw() {
  background(220);

  stroke('green');
  fill('green');

  for (let theRect of terrain) {
    rect(theRect.x, theRect.y, theRect.w, theRect.h);
  }

  PlayerOnTerrain();
  push();
  translate(player.x + player.w/2, player.y + player.h/2);

  rotate(player.angle);

  rectMode(CENTER);
  fill('black');
  rect(0, 0, player.w, player.h);
  rectMode(CORNER);
  pop();
}

function generateTerrain() {
  let theWidth = width/NUMBER_RECTS;
  let time = 0;
  let deltaTime = 0.001;
  for (let i = 0; i < NUMBER_RECTS; i++) {
    let theHeight = noise(time) * height;
    let someRect = spawnRectangle(theWidth * i, theWidth, theHeight);
    terrain.push(someRect);
    time += deltaTime;
  }
}

function spawnRectangle(leftSide, rectWidth, rectHeight) {
  let theRect = {
    x: leftSide,
    y: height - rectHeight,
    w: rectWidth,
    h: rectHeight,
  };

  return theRect;
}

let player = {
  x: 100,
  y: 100,
  w: 300,
  h: 100,
  angle: 0,
};

function getTerrainY(x) {
  let i = Math.floor(x/(width/NUMBER_RECTS));
  i = constrain(i, 0, terrain.length - 1);

  return terrain[i].y;
}


function PlayerOnTerrain() {

  let leftX = player.x;
  let rightX = player.x + player.w;
  let leftY = getTerrainY(leftX);
  let rightY = getTerrainY(rightX);

  //find the angle in radians of the point to the x axis 
  player.angle = Math.atan2(rightY - leftY, rightX - leftX);

  //put the player in the centre of the y points
  player.y = (leftY + rightY) / 2 - player.h;
}