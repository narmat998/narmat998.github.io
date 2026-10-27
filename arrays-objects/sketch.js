// Arrays and Object Notation Project/ Tanks
// Narayan Thibodeau
// October 7th, 2026
//
// Extra for Experts:
// I learned about the ternary operator (?) to condense if statements (I didn't end up using it as much as I thought in the end,)
// as well as learning about the trigonometry functions inside javascript. I also learned about constrain as an easier way to confine values rather than lengthy if statements. 
// I also learned about map and how to use it to take a range of values and map it to another range of values. 
// Getting parabolic motion to track to adjustable varaibles was really complicated at first because i was originally just using the entire width of the screen and mouseX, and displaying a live trajectory parabola, but eventually pivoted to using sliders.
//I was inspired by this game and it's use of sliders: https://www.mathsisfun.com/games/tanks.html.

//To play the game, the blue tank uses A and D, and the red tank uses J and L. 
// The one slider dictates the angle of the barrel, and the other slider maps the amounts of power in firing a shell from your tank. when you get hit, you blow up.
//For some strange reason I cannot find, the instructions bolds itself when you fire if you dont just toggle it off.

//global variables
let game = 'yes';
let angleSlider;

let trajectorySlider;

let turn = 'blue';
let turnTime = 15000;

let lastTurnTime = 0;
let terrain = [];
const NUMBER_RECTS = 2000;

let shells = [];
let explosions = [];

let shellSpeedX = 10;
let shellSpeedY = 10;
let gravity = 0.2;

let hitTank;
let speed = 1;

let instructions = 'show';

let winner = null;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  tankRed.x = width*5/6;
  tankBlue.x = width/6;
  generateTerrain();
  rectMode(CORNER);
  angleSlider = width/4 + 180;
  trajectorySlider = height/8 + 90;
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
  trajectoryPicker();
  fireButton();
  
  turnSelector();
  turnTimer();
  
  updateShells();
  updateExplosions();

  makeInstructions();

  if (game === 'no') {
    showWinner();
    return; 
  }

}


function generateTerrain() {
  //use perlin noise to make the terrain randomly generated
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

//make the rectangles to fill the terrain
function spawnRectangle(leftSide, rectWidth, rectHeight) {
  let theRect = {
    x: leftSide,
    y: height - rectHeight,
    w: rectWidth,
    h: rectHeight,
  };
  
  return theRect;
}

//blue tank
let tankBlue = {
  w: 50,
  h: 25,
  angle: 0,
  barrelW: 15,
  barrelH: 40,
  barrelAngle: 0,
};

//red tank
let tankRed = {
  w: 50,
  h: 25,
  angle: 0,
  barrelW: 15,
  barrelH: 40,
  barrelAngle: 0,
};

function getTerrainY(x) {
  //find the y value for an x value
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
  translate(tank.x + tank.w/2, tank.y + tank.h/2);
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
  //use a and d to move the blue tank, and j and l to move the red tank
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

//move the tank barrel to the anglesliders position
function moveBarrel(tank) {
  let angle = map(angleSlider, width/4, width/4 + 360, -90, 90);
  tank.barrelAngle = radians(angle) - radians(tank.angle);
  tank.barrelAngle = constrain(tank.barrelAngle, -PI/2, PI/2); 
}

function turnSelector() {
//if its that tanks turn allow its barrel to move, if the turn timer is esxceeded, switch turns
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
  //if the game is still going and you click on the fire button check whoes turn it is and fire a shell from their tank
  if (mouseX > width/9 -40 && mouseX < width/9 + 40 && mouseY > height/8 - 40 && mouseY < height/8 + 40 && game === 'yes') {
    if (turn === 'blue') {
      fireShell(tankBlue);
      lastTurnTime = millis(); 
      turn = 'red';
    }
    else if (turn === 'red') {
      fireShell(tankRed);
      lastTurnTime = millis();    
      turn = 'blue';
    }
  }
}

function fireShell(tank) {
  let angle = tank.angle + tank.barrelAngle;
  //track the strength to the trajectory slider 
  let launchStrength = map(trajectorySlider, height / 8, height / 8 + 180, 20, 5);
  
  let tankCenterX = tank.w/2;
  let tankCenterY = tank.h/2;
  
  //shell starting point to end of barrel  
  let startX = tankCenterX + cos(angle - PI/2) * tank.barrelH;
  let startY = tankCenterY + sin(angle - PI/2) * tank.barrelH;
  
  let tankShell = {
    x: tank.x + startX,
    y: tank.y + startY,
    radius: 5,
    velocityX: launchStrength * cos(angle - PI/2),
    velocityY: launchStrength * sin(angle - PI/2),
  };
  
  shells.push(tankShell);
}

function updateShells() {
  for (let i = shells.length-1; i >= 0; i--) {
    
    let tankShell = shells[i];
    tankShell.velocityY += gravity;

    tankShell.x += tankShell.velocityX;
    tankShell.y += tankShell.velocityY;

    hitTank = hitDetector(tankShell);
    if (hitTank !== null) {
      winner = hitTank === tankBlue ? 'Red' : 'Blue';

      explode(hitTank);
      shells.splice(i, 1);
      game = 'no'
      return;
    }

    let groundY = getTerrainY(tankShell.x);

    //remove shell if it hits the ground
    if (tankShell.y + tankShell.radius >= groundY) {
      shells.splice(i, 1);
      continue;
    }
    
    //make the shell
    fill('yellow');
    noStroke();
    circle(tankShell.x, tankShell.y, tankShell.radius*2);
  }
}

function anglePicker() {
  let barX = width/4;
  let barY = height/8;

  fill('red');
  stroke('red');
  rect(barX, barY, 360, 30);

  textSize(30);
  fill('black');
  stroke('black');
  rect(angleSlider, barY, 10, 30);
  text('Angle', width/4 + 145, height/8 - 20);

  //the slider tracks to the mouse when its clicked and in the area
  if (mouseY > height/8 && mouseY < height/8 + 30 && mouseX > width/4 && mouseX < width/4 + 360 && mouseIsPressed && game === 'yes') {
    angleSlider = mouseX;
  }
}

function trajectoryPicker() {
  let barX = width*3/4;
  let barY = height/8;

  fill('red');
  stroke('red');
  rect(barX, barY, 30, 180);

  textSize(30);
  fill('black');
  stroke('black');
  rect(barX, trajectorySlider, 30, 10);
  text('Power', width*3/4 - 30, height/8 + 220)

  //the slider tracks to the mouse when its clicked and in the area
  if (mouseY > height/8 && mouseY < height/8 + 180 && mouseX > width*3/4 && mouseX < width*3/4 + 30 && mouseIsPressed && game === 'yes') {
    trajectorySlider = mouseY;
  }
}

function fireButton() {
  //if you hover over the fire button make it grey
  if (mouseX > width/9 -40 && mouseX < width/9 + 40 && mouseY > height/8 - 40 && mouseY < height/8 + 40 && game === 'yes') {
    fill('gray');
    stroke('black');
    circle(width/9, height/8, 80);
  }
  else {
    fill('red');
    stroke('black');
    circle(width/9, height/8, 100);
    fill('black');
    text('FIRE', width/9 - 35, height/8 + 10);  
  }
}

function turnTimer() {
  let timer = (millis() - lastTurnTime)/1000;
  
  //if no winner show the turn and the time
  if (hitTank === null && game === 'yes') {
    textSize(30);
    fill('black');
    text(`${turn}'s turn`, width/3.35, height/5);
    text(`Turn time: ${timer.toFixed(2)}`, width/3.35, height/5 + 30);
  }


}

function hitDetector(shell) {
  //check blue tank
  if (collideRectCircle(tankBlue.x, tankBlue.y, tankBlue.w, tankBlue.h, shell.x, shell.y, shell.radius * 2) === true) {
    return tankBlue;
  }
  //check red tank
  if (collideRectCircle(tankRed.x, tankRed.y, tankRed.w, tankRed.h, shell.x, shell.y, shell.radius * 2) === true) {
    return tankRed;
  }

  return null;
}

function explode(tank) {
  //make 50 circles
  for (let i = 0; i < 50; i++) {
    explosions.push({
      x: tank.x + tank.w/2,
      y: tank.y + tank.h/2,
      velocityX: random(-5, 5),
      velocityY: random(-5, 5),
      radius: random(3, 20),
      life: 60,
    });
  }

  //make the tank go off screen 
  tank.x = 4000;
}

function updateExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    let debris = explosions[i];

    //move debris
    debris.x += debris.velocityX;
    debris.y += debris.velocityY;
    debris.life-- ;

    //randomly colour the circles
    fill(random(0, 255), random(0, 255), random(0, 255));
    noStroke();
    circle(debris.x, debris.y, debris.radius * debris.life / 60);

    //if the debris has existed for its lifespan get rid of it
    if (debris.life <= 0) {
      explosions.splice(i, 1);
    }
  }
}

function makeInstructions() {
  if (instructions === 'show') {
    fill('black');
    textFont('Arial');
    textStyle(NORMAL);
    textSize(30);
    text('Blue tank uses A and D to move, Red tank uses J and L to move. Use the angle and trajectory sliders to pick your trajectory. Use Ctrl + R to play again.', width/10, height*7/8);
  }
}


function keyPressed() {
  //toggle instructions
  if (key === 'i') {
    if (instructions === 'show') {
      instructions = 'hide';
    }
    else if (instructions === 'hide') {
      instructions = 'show';
    }
  }  
}

function showWinner() {
  //show the winner

  fill('black');
  textSize(50);

  text(`${winner} Tank Won!`, width/2 - 25, height/2);
  turnTime = '';
  turn = '';

  textSize(20);
  text('Press Ctrl + R to play again', width/2, height/2 + 60);
}