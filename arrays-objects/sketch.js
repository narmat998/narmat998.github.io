// Arrays and Object Notation Project/ Tanks
// Narayan Thibodeau
// October 7th, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//comment as you go so you dont lose your mind


let turn = 'blue';
let turnTime = 10000;

let lastTurnTime = 0;
let terrain = [];
const NUMBER_RECTS = 2000;

let shells = [];

let shellSpeed = 1;
let gravity = 0.2;
let trajectoryDots = 50;

let speed = 1;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  tankRed.x = width*5/6;
  tankBlue.x = width/6;
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

  turnSelector();

  updateShells();
}

function generateTerrain() {
  let theWidth = width/NUMBER_RECTS;
  let time = 0;
  let changeTime = 0.001;
  for (let i = 0; i < NUMBER_RECTS; i++) {
    let theHeight = noise(time) * height;
    let someRect = spawnRectangle(theWidth * i, theWidth, theHeight);
    terrain.push(someRect);
    time += changeTime;
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
  w: 50,
  h: 25,
  angle: 0,
  barrelW: 15,
  barrelH: 40,
  barrelAngle: 0,
};

let tankRed = {
  w: 50,
  h: 25,
  angle: 0,
  barrelW: 15,
  barrelH: 40,
  barrelAngle: 0,
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

  //make just the tank rotate
  push();

  // move to centre of tank
  translate(tank.x + tank.w / 2, tank.y + tank.h / 2);
  rotate(tank.angle);

  //draw tank
  if (tank === tankBlue) {
    fill('blue');
  } 
  else if (tank === tankRed) {
    fill('red');
  }
  push();
  //make the tank barrel first so it sits behind the tank
  rotate(tank.barrelAngle);
  rect(0 - tank.w/6, 0 - tank.barrelH, tank.barrelW, tank.barrelH);
  pop();

  //make the tank 
  rect(-tank.w/2, -tank.h / 2, tank.w, tank.h);
  pop();
}

function moveTanks() {
  if (keyIsDown('d') && turn === 'blue') {
    if (tankBlue.x < window.width - tankBlue.w) {
      tankBlue.x += speed;
    }
  }
  if (keyIsDown('a') && turn === 'blue') {
    if (tankBlue.x > 0) {
      tankBlue.x -= speed;
    }
  }
  if (keyIsDown('l') && turn === 'red') {
    if (tankRed.x < window.width - tankRed.w) {
      tankRed.x += speed;
    }
  }
  if (keyIsDown('j') && turn === 'red') {
    if (tankRed.x > 0) {
      tankRed.x -= speed;
    }
  }
}

function moveBarrel(tank) {
  let tankCenterX = tank.x + tank.w / 2;
  let tankCenterY = tank.y + tank.h / 2;

  //angle from tank to mouse
  let dx = mouseX - tankCenterX;
  let dy = mouseY - tankCenterY;
  let angle = atan2(dy, dx);

  tank.barrelAngle = angle - tank.angle + PI/2;
  if (tank.barrelAngle > 60) {
    tank.barrelAngle = 60;
  }
  else if (tank.angle < -60) {
    tank.barrelAngle = -60;
  }

  tank.barrelAngle = radians(angle);  
}

function turnSelector() {
  if (turn === 'blue') {
    drawTrajectory(tankBlue);
    moveBarrel(tankBlue);
  }
  else if (turn === 'red') {
    drawTrajectory(tankRed);
    moveBarrel(tankRed);
  }

  if (millis() > turnTime + lastTurnTime) {
    lastTurnTime = millis();
    if (turn === 'blue') {
      turn = 'red';
    }
    else if (turn === 'red') {
      turn = 'blue';
    }
  }
}

function mousePressed() {
  if (turn === 'blue') {
    lastTurnTime = millis(); 
    turn = 'red';
    fireShell(tankBlue);
  }
  else if (turn === 'red') {
    lastTurnTime = millis();    
    turn = 'blue';
    fireShell(tankRed);
  }
}


function drawTrajectory(tank) {
  let tankCenterX = tank.x + tank.w / 2;
  let tankCenterY = tank.y + tank.h / 2;

  let angle = tank.angle + tank.barrelAngle;
  let barrelLength = tank.barrelH;

  // Start at the tip of the barrel
  let startX = tankCenterX + sin(angle) * barrelLength;
  let startY = tankCenterY - cos(angle) * barrelLength;

  // Calculate initial velocity
  let velocityX = sin(angle) * shellSpeed;
  let velocityY = -cos(angle) * shellSpeed;

  fill(50);
  noStroke();

  // Predict where the shell will be at each future frame
  for (let t = 1; t <= trajectoryDots; t += 2) {
    let x = startX + velocityX * t;
    let y = startY + velocityY * t
      + 0.5 * gravity * t * t;

    circle(x, y, 6);
  }
}

function fireShell(tank) {
  let tankCenterX = tank.x + tank.w / 2;
  let tankCenterY = tank.y + tank.h / 2;

  let angle = tank.angle + tank.barrelAngle;
  let barrelLength = tank.barrelH;

  let startX = tankCenterX + sin(angle) * barrelLength;
  let startY = tankCenterY - cos(angle) * barrelLength;

  let tankShell = {
    x: startX,
    y: startY,
    velocityX: sin(angle) * shellSpeed,
    velocityY: -cos(angle) * shellSpeed,
  };

  shells.push(tankShell);
}

function updateShells() {
  for (let i = 0; i < shells.length; i++) {

    let tankShell = shells[i];
    tankShell.x += tankShell.velocityX;
    tankShell.y += tankShell.velocityY;

    tankShell.velocityY += gravity;

    fill('yellow');
    noStroke();
    circle(tankShell.x, tankShell.y, 10);
  }
}