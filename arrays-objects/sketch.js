// Arrays and Object Notation Project/ Tanks
// Narayan Thibodeau
// October 7th, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//comment as you go so you dont lose your mind
let terrain = [];
const NUMBER_RECTS = 2000;


let speed = 3;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  generateTerrain();
  rectMode(CORNER);
}

function draw() {
  background(220);

  stroke('green');
  fill('green');
  for (let theRect of terrain) {
    rect(theRect.x, theRect.y, theRect.w, theRect.h);
  }

  tankOnTerrain(tankBlue);
  tankOnTerrain(tankRed);
  moveTanks();

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

let tankBlue = {
  x: 100,
  y: 100,
  w: 50,
  h: 25,
  angle: 0,
};

let tankRed = {
  x: 400,
  y: 100,
  w: 50,
  h: 25,
  angle: 0,
};

function getTerrainY(x) {
  let i = Math.floor(x/(width/NUMBER_RECTS));
  i = constrain(i, 0, terrain.length - 1);

  return terrain[i].y;
}

function tankOnTerrain(tank) {
  //use left corner as left x and right corner as right x
  let leftX = tank.x;
  let rightX = tank.x + tank.w;

  //get y value at x positions
  let leftY = getTerrainY(leftX);
  let rightY = getTerrainY(rightX);

  //find tank angle with the two y values
  tank.angle = Math.atan2(rightY - leftY, rightX - leftX);
  tank.y = (leftY + rightY) / 2 - tank.h;

  //save current drawing
  push();

  // move to centre of tank
  translate(
    tank.x + tank.w / 2,
    tank.y + tank.h / 2
  );
  rotate(tank.angle);

  //draw tank
  if (tank === tankBlue) {
    fill('blue');
  } 
  else if (tank === tankRed) {
    fill('red');
  }

  rect(-tank.w / 2, -tank.h / 2, tank.w, tank.h);
  // restore last drawing 
  pop();
}

function moveTanks() {
  if (keyIsDown('d')) {
    if (tankBlue.x < window.width - tankBlue.w) {
      tankBlue.x += speed;
    }
  }
  if (keyIsDown('a')) {
    if (tankBlue.x > 0) {
      tankBlue.x -= speed;
    }
  }
  if (keyIsDown('l')) {
    if (tankRed.x < window.width - tankRed.w) {
      tankRed.x += speed;
    }
  }
  if (keyIsDown('j')) {
    if (tankRed.x > 0) {
      tankRed.x -= speed;
    }
  }
}
////////////
// let parentRect = {
//   x: 100,
//   y: 100,
//   w: 150,
//   h: 100
// };

// // Child rectangle object (relative position)
// let childRect = {
//   offsetX: 20,
//   offsetY: 30,
//   w: 50,
//   h: 30
// };

// function setup() {
//   createCanvas(400, 400);
// }

// function draw() {
//   background(220);

//   // Draw parent rectangle
//   rect(parentRect.x, parentRect.y, parentRect.w, parentRect.h);

//   // Draw child rectangle relative to parent
//   rect(parentRect.x + childRect.offsetX, parentRect.y + childRect.offsetY, childRect.w, childRect.h);
// }

// // Optional: Move parent with mouse
// function mouseDragged() {
//   parentRect.x = mouseX - parentRect.w / 2;
//   parentRect.y = mouseY - parentRect.h / 2;
// }