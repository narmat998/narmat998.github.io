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

//outfits
let blueShirt;
let bluePants;
let blackPants;
let blueOnBlue;
let blazer;
let suit;
let outfit;

//outfits with hair
let blueShirtHair1;
let bluePantsHair1;
let blackPantsHair1;
let blueOnBlueHair1;
let blazerhair1;
let suitHair1;

//base characetr
let baseCharacter;

async function setup() {
  createCanvas(windowWidth, windowHeight);;
  noStroke();
  rectMode(CENTER);
  speed = 8;
  stage = 1;
  x = width/2;
  y = height*2/3;


  //ALL SPRITES GO HERE!!! DONT LOSE THEM
  swordSprite = await loadImage("sword.png");
  swordSwing = await loadImage("sword_swipe.png");

  blueShirt = await loadImage("blue_shirt_no_pants.png");
  bluePants = await loadImage("no_shirt_blue_pants.png");
  blueOnBlue = await loadImage("blue_shirt_blue_pants.png");
  blackPants = await loadImage("no_shirt_black_pants.png");
  blazer = await loadImage("blazer_no_pants.png");
  suit = await loadImage("full_suit.png");

  blueShirtHair1 = await loadImage('blue_shirt_no_pants_hair1.png');
  bluePantsHair1 = await loadImage("no_shirt_blue_pants_hair1.png");
  blackPantsHair1 = await loadImage("blue_shirt_blue_pants_hair1.png");
  blueOnBlueHair1 = await loadImage("no_shirt_black_pants_hair1.png");
  blazerhair1 = = await loadImage("blazer_no_pants.png");
  suitHair1

  baseCharacter = await loadImage("no_pants_no_shirt_(og).png");


}

function draw() {
  
  checkStage();
  makeCharacter();
  moveCharacter();
  makeSword();
  stageTransitions();
}

function makeCharacter() {
  image(baseCharacter, x-200, y-200, 400, 400);
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

function makeSword() {
  image(swordSprite, x - 110, y - 130, 240, 260);
}