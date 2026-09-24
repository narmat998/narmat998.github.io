// Interactive Scene
// Narayan Thibodeau
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let x;
let y;

let dx;
let dy;

let speed;

let stage;

let swordSprite;
let swordSwing;

async function setup() {
  createCanvas(windowWidth, windowHeight);;
  noStroke();
  rectMode(CENTER);
  speed = 8;
  stage = 1;
  x = width/2;
  y = height*2/3;

  swordSprite = await loadImage("sword.png");
  swordSwing = await loadImage("sword_swipe.png");

}

function draw() {
  
  checkStage();
  makeCharacter();
  moveCharacter();
  stageTransitions();
}

function makeCharacter() {
  fill('blue');
  rect(x, y, 30, 60);
}


function moveCharacter() {
  if (keyIsDown('w') || keyIsDown(UP_ARROW)) {
    y -= speed;
  }
  if (keyIsDown('s') || keyIsDown(DOWN_ARROW)) {
    y += speed;
  }

  if (keyIsDown('d') || keyIsDown(RIGHT_ARROW)) {
    x += speed;
  }
  if (keyIsDown('a') || keyIsDown(LEFT_ARROW)) {
    x -= speed;
  }
}

function keyPressed(){
  if (key === 'g') {
    
  }
}

function checkStage() {
  if (stage === 1) {
    background('white');
  }
  else if (stage === 2) {
    background('red');
  }
  else if (stage === 3) {
    background('green');
  }
  else if (stage === 4) {
    background('grey');
  }
  else if (stage === 5) {
    background('black');
  }
}

function stageTransitions() {
  if (stage === 1) {
    if (x > width) {
      stage = 2;
      x = 0;
    }
    else if (x < 0) {
      stage = 3;
      x = width; 
    }
    else if ( y < 0) {
      stage = 4;
      y = height;
    }
    else if ( y > height) {
      stage = 5;
      y = 0;
    }
  }
  else if (stage === 2) {
    if (x < 0) {
      stage = 1;
      x = width;
    }
  }
  else if (stage === 3) {
    if (x > width) {
      stage = 1;
      x = 0;
    }
  }
  else if (stage === 4) {
    if (y > height) {
      stage = 1;
      y = 0;
    }
  }
  else if (stage === 5) {
    if (y < 0) {
      stage = 1;
      y = height;
    }
  } 
}
