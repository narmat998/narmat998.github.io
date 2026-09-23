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

async function setup() {
  createCanvas(windowWidth, windowHeight);;
  noStroke();
  rectMode(CENTER);
  x = width/2;
  y = height*2/3;
  speed = 8;
  stage = 1;
}

function draw() {

  makeCharacter();
  moveCharacter();
  checkStage();
}

function makeCharacter() {
  fill('blue');
  rect(x, y, 60, 40);
}


function moveCharacter() {
  // if (keyIsDown('w') || keyIsDown(UP_ARROW)) {
  //   y -= speed;
  // }
  // if (keyIsDown('s') || keyIsDown(DOWN_ARROW)) {
  //   y += speed;
  // }

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
    x = width/2;
    y = height*2/3;
    if (x >= width + 20) {
      stage = 2;
    }
    else if (x <= width - 20) {
      stage = 3;
    }
  }
  else if (stage === 2) {
    background('red');
    x = width/4;
    y = height*2/3;
    if (x <= width - 20) {
      stage = 1;
    }
  }
  else if (stage === 3) {
    background('green');
    x = width * 3/4;
    y = height*2/3;
  }


}



