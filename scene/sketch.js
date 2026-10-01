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
let blazerHair1;
let suitHair1;
let onlyHair1;

//base characetr
let baseCharacter;

let hair = 'show';
let shirt = 'show';
let bluePantsDisplayer = 'show';
let blackPantsDisplayer = 'show';
let blazerDisplayer = 'show';

async function setup() {
  createCanvas(windowWidth, windowHeight);;
  noStroke();
  rectMode(CENTER);
  speed = 8;
  stage = 1;
  x = width/2;
  y = height*2/3;


  //ALL SPRITES GO HERE!!! DONT LOSE THEM
  blueShirt = await loadImage("blue_shirt_no_pants.png");
  bluePants = await loadImage("no_shirt_blue_pants.png");
  blueOnBlue = await loadImage("blue_shirt_blue_pants.png");
  blackPants = await loadImage("no_shirt_black_pants.png");
  blazer = await loadImage("blazer_no_pants.png");
  suit = await loadImage("full_suit.png");

  blueShirtHair1 = await loadImage('blue_shirt_no_pants_hair1.png');
  bluePantsHair1 = await loadImage("no_shirt_blue_pants_hair1.png");
  onlyHair1 = await loadImage('no_shirt_no_pants_hair1.png');
  blackPantsHair1 = await loadImage("no_shirt_black_pants_hair1.png");
  blueOnBlueHair1 = await loadImage("blue_shirt_blue_pants_hair1.png");
  blazerHair1 = await loadImage("blazer_hair1.png");
  suitHair1 = await loadImage("full_suit_hair1.png");

  blueShirtSprite = await loadImage('BLUESHIRT.png');
  bluePantsSprite = await loadImage('BLUEPANTS.png');
  blackPantsSprite = await loadImage('BLACKPANTS.png');
  blazerSprite = await loadImage('BLAZER.png');
  hairSprite = await loadImage('HAIR.png');


  baseCharacter = await loadImage("no_pants_no_shirt_(og).png");

  outfit = baseCharacter;
}

function draw() {
  
  stageTransitions();
  checkStage();
  makeClothes();
  makeCharacter();
  moveCharacter();
}

function makeCharacter() {
  image(outfit, x-200, y-200, 400, 400);
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

function makeClothes() {
  if (stage === 2 && hair === 'show') {
    image(hairSprite, 100, 500, 200, 200);
  }
  if (stage === 1 && shirt === 'show') {
    image(blueShirtSprite, 600, 400, 200, 200);
  }
  if (stage === 4 && bluePantsDisplayer === 'show') {
    image(bluePantsSprite, 200, 800, 200, 200);
  }
  if (stage === 3 && blackPantsDisplayer === 'show') {
    image(blackPantsSprite, 700, 100, 200, 200);
  }
  if (stage === 5 && blazerDisplayer === 'show') {
    image(blazerSprite, 500, 500, 200, 200);
  }
}


function keyPressed(){
  if (key === 'e') {
    if (stage === 1 && x >= 600 && x <= 800 && y >= 400 && y <= 600 && shirt === 'show') {
      if (outfit === baseCharacter) {
        outfit = blueShirt;
        shirt = 'hide';
      }
      else if (outfit === onlyHair1) {
        outfit = blueShirtHair1;
        shirt = 'hide';
      }
      else if (outfit === bluePants) {
        outfit = blueOnBlue;
        shirt = 'hide';
      }
      else if (outfit === bluePantsHair1) {
        outfit = blueOnBlueHair1;
        shirt = 'hide';
      }
    }
    if (stage === 2 && x >= 100 && x <= 300 && y>= 500 && y <= 700 && hair === 'show') {
      hair = 'hide';
      if (outfit === baseCharacter) {
        outfit = onlyHair1;
      }
      else if (outfit === suit) {
        outfit = suitHair1;
      }
      else if (outfit === blazer) {
        outfit = blazerHair1;
      }
      else if (outfit === blueOnBlue) {
        outfit = blueOnBlueHair1;
      }
      else if (outfit === blackPants) {
        outfit = blackPantsHair1;
      }
      else if (outfit === bluePants) {
        outfit = bluePantsHair1;
      }
      else if (outfit === blueShirt) {
        outfit = blueShirtHair1;
      }
    }
    if (stage === 3 && x >= 700 && x <= 900 && y>= 100 && y <= 300 && blackPantsDisplayer === 'show') {
      if (outfit === baseCharacter) {
        outfit = blackPants;
        blackPantsDisplayer = 'hide';
      }
      else if (outfit === onlyHair1) {
        outfit = blackPantsHair1;
        blackPantsDisplayer = 'hide';
      }
      else if (outfit === blazer) {
        outfit = suit;
        blackPantsDisplayer = 'hide';
      }
      else if (outfit === blazerHair1) {
        outfit = suitHair1;
        blackPantsDisplayer = 'hide';
      }
    }
    if (stage === 4 && x >= 200 && x <= 400 && y>= 800 && y <= 1000 && bluePantsDisplayer === 'show') {
      if (outfit === baseCharacter) {
        outfit = bluePants;
        bluePantsDisplayer = 'hide';
      }
      else if (outfit === onlyHair1) {
        outfit = bluePantsHair1;
        bluePantsDisplayer = 'hide';
      }
      else if (outfit === blueShirt) {
        outfit = blueOnBlue;
        bluePantsDisplayer = 'hide';
      }
      else if (outfit === blueShirtHair1) {
        outfit = blueOnBlueHair1;
        bluePantsDisplayer = 'hide';
      }
    }
    if (stage === 5 && x >= 500 && x <= 700 && y>= 500 && y <= 700 && blazerDisplayer === 'show') {
      if (outfit === baseCharacter) {
        outfit = blazer;
        blazerDisplayer = 'hide';
      }
      else if (outfit === blackPants) {
        outfit = suit;
        blazerDisplayer = 'hide';
      }
      else if (outfit === blackPantsHair1) {
        outfit = suitHair1;
        blazerDisplayer = 'hide';
      }
      else if (outfit === onlyHair1) {
        outfit = blazerHair1;
        blazerDisplayer = 'hide';
      }
    }
  }
  if (key === 'r') {
    outfit = baseCharacter;
    shirt = 'show';
    hair = 'show';
    blackPantsDisplayer = 'show';
    bluePantsDisplayer = 'show';
    blazerDisplayer = 'show';
  }
}