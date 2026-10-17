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
  let distance = mouseX - (tank.x + tank.w/2);
  let angle = map(distance, -200, 200, -60, 60);
  if (angle > 60) {
    angle = 60;
  }
  else if (angle < -60) {
    angle = -60;
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
    }
  else if (turn === 'red') {
    lastTurnTime = millis();    
    turn = 'blue';
    }
}


function drawTrajectory(tank) {
  let tankCenterX = tank.x + tank.w/2;
  let tankCenterY = tank.y + tank.h/2;

  //calculate barrel angle to track the barrels x value
  let angle = tank.angle + tank.barrelAngle;

  //go to end of the barrel
  let barrelLength = tank.barrelH;

  //calculate how much the barrel points off of the vertical and finds the distance of the barrel length in the direction of the angle to move the start of the parabola to the tip of the barrel 
  let tankCenterX2 = tankCenterX + sin(angle) * barrelLength;

  //calculate how much the barrel deviates while rotating and moves the bottom of the parabola to the tip of the barrel on the y axis
  let tankCenterY2 = tankCenterY - cos(angle) * barrelLength;

  // Aim toward mouse
  let pointX = mouseX - tankCenterX2;
  let pointY = mouseY - tankCenterY2;

  let aimAngle = atan2(pointY, pointX);

  let factorA = 10;
  let PointX2 = cos(aimAngle) * factorA;
  let PointY2 = map(pointY, 200, -200, 0, -10);

  let drop = 0.4;

  // Draw dotted trajectory
  fill(50);
  noStroke();

  for (let i = 2; i <= 30; i += 2) {
    let x = tankCenterX2 + PointX2 * i;
    let y = tankCenterY2 + PointY2 * i + 0.5 * drop * i * i;

    circle(x, y, 5);
  }
}
