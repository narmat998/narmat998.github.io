// Arrays and Object Notation Project/ Tanks
// Narayan Thibodeau
// October 7th, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let angleSlider;
let barSliderTurn;

let trajectoryPickerTurn;
let trajectorySlider;

let turn = 'blue';
let turnTime = 10000;

let lastTurnTime = 0;
let terrain = [];
const NUMBER_RECTS = 2000;

let shells = [];

let shellSpeed = 15;
let gravity = 0.2;

let speed = 1;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  tankRed.x = width*5/6;
  tankBlue.x = width/6;
  generateTerrain();
  rectMode(CORNER);
  angleSlider = width/4 + 180;
  trajectorySlider = height/8 + 90;
  barSliderTurn = true;
  trajectoryPickerTurn = false;
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
  anglePicker();

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
  let angle = map(angleSlider, width/4, width/4 + 360, -90, 90);
  tank.barrelAngle = radians(angle) - radians(tank.angle);
  tank.barrelAngle = constrain(tank.barrelAngle, -PI/2, PI/2); 
}

function turnSelector() {
  if (turn === 'blue') {
    moveBarrel(tankBlue);
  }
  else if (turn === 'red') {
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
  if (mouseY > height/8 && mouseY < height/8 + 30 && mouseX > width/4 && mouseX < width/4 + 360 && barSliderTurn === true) {
    barSliderTurn = false;
    trajectoryPickerTurn = true;
  }
}

function fireShell(tank) {
  let tankCenterX = tank.width/2;
  let tankCenterY = tank.width/2;

  
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

function anglePicker() {
  let barX = width/4;
  let barY = height/8;

  fill('red');
  stroke('red');
  rect(barX, barY, 360, 30);

  fill('black');
  stroke('black');
  rect(angleSlider, barY, 10, 30);

  if (mouseY > height/8 && mouseY < height/8 + 30 && mouseX > width/4 && mouseX < width/4 + 360 && barSliderTurn === true) {
    angleSlider = mouseX;
  }
}

function trajectoryPicker() {
  let barX = width*3/4;
  let barY = height/8;

  fill('red');
  stroke('red');
  rect(barX, barY, 30, 180);

  fill('black');
  stroke('black');
  rect(barX, trajectorySlider, 30, 10);

  if (mouseY > height/8 && mouseY < height/8 + 180 && mouseX > width/4 && mouseX < width/4 + 30 && trajectoryPickerTurn === true) {
    trajectorySlider = mouseY;
  }
}