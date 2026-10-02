// Interactive Scene
// Narayan Thibodeau
// October 2nd, 2026
//
// Extra for Experts:
// I used many sprites, and while somewhat inneficient, made specific outfits for each clothing item when equipped with others. 
// You cannot wear blue and black together, as they don't match, and you traverse the different "stages" to find all the clothes.

let x;
let y;

let dx;
let dy;

let speed;

let stage;

let instructions = 'show';

let screenSizer;

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

  screenSizer  = windowHeight/1080;

  //all outfit sprites
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
  makeInstructions();
}

function makeCharacter() {
  image(outfit, x - 200 * screenSizer , y - 200 * screenSizer , 400 * screenSizer , 400 * screenSizer );
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
    background('yellow');
  }
  else if (stage === 3) {
    background('lightgreen');
  }
  else if (stage === 4) {
    background('grey');
  }
  else if (stage === 5) {
    background('lightblue');
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
    else if (x > width) {
      x = width;
    }
    else if(y > height) {
      y = height;
    }
    else if (y < 0) {
      y = 0;
    }
  }
  else if (stage === 3) {
    if (x > width) {
      stage = 1;
      x = 0;
    }
    else if (x < 0 + 50 * screenSizer) {
      x = 0+ 50 * screenSizer;
    }
    else if(y > height) {
      y = height;
    }
    else if (y < 0) {
      y = 0;
    }
  }
  else if (stage === 4) {
    if (y > height) {
      stage = 1;
      y = 0;
    }
    else if (x > width) {
      x = width;
    }
    else if(x < 0 + 50 * screenSizer) {
      x = 0 + 50 * screenSizer;
    }
    else if (y < 0) {
      y = 0;
    }
  }
  else if (stage === 5) {
    if (y < 0) {
      stage = 1;
      y = height;
    }
    else if (x > width) {
      x = width;
    }
    else if(y > height) {
      y = height;
    }
    else if (x < 0 + 50 * screenSizer) {
      x = 0 + 50 * screenSizer;
    }
  } 
}

function makeClothes() {
  if (stage === 2 && hair === 'show') {
    image(hairSprite, 100* screenSizer , 500* screenSizer , 200* screenSizer , 200* screenSizer );
  }
  if (stage === 1 && shirt === 'show') {
    image(blueShirtSprite, 600 * screenSizer , 400 * screenSizer , 200 * screenSizer , 200 * screenSizer );
  }
  if (stage === 4 && bluePantsDisplayer === 'show') {
    image(bluePantsSprite, 200 * screenSizer , 800 * screenSizer , 200 * screenSizer , 200 * screenSizer );
  }
  if (stage === 3 && blackPantsDisplayer === 'show') {
    image(blackPantsSprite, 700 * screenSizer , 100 * screenSizer , 200 * screenSizer , 200 * screenSizer );
  }
  if (stage === 5 && blazerDisplayer === 'show') {
    image(blazerSprite, 500 * screenSizer , 500 * screenSizer , 200 * screenSizer , 200 * screenSizer );
  }
}


function keyPressed(){
  if (key === 'r') {
    outfit = baseCharacter;
    shirt = 'show';
    hair = 'show';
    blackPantsDisplayer = 'show';
    bluePantsDisplayer = 'show';
    blazerDisplayer = 'show';
  }
  if (key === 'i') {
    if (instructions === 'show') {
      instructions = 'hide';
    }
    else if (instructions === 'hide') {
      instructions = 'show';
    }
  }
}


function mouseClicked() {
  if (stage === 1 && x >= 600 * screenSizer && x <= 800 * screenSizer && y >= 400 * screenSizer && y <= 600 * screenSizer && shirt === 'show') {
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
  if (stage === 2 && x >= 100 * screenSizer && x <= 300 * screenSizer && y>= 500 * screenSizer && y <= 700 * screenSizer && hair === 'show') {
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
  if (stage === 3 && x >= 700 * screenSizer && x <= 900 * screenSizer && y>= 100 * screenSizer && y <= 300 * screenSizer && blackPantsDisplayer === 'show') {
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
  if (stage === 4 && x >= 200 * screenSizer && x <= 400 * screenSizer && y>= 800 * screenSizer && y <= 1000 * screenSizer && bluePantsDisplayer === 'show') {
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
  if (stage === 5 && x >= 500 * screenSizer && x <= 700 * screenSizer && y>= 500 * screenSizer && y <= 700 * screenSizer && blazerDisplayer === 'show') {
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


function makeInstructions() {
  if (instructions === 'show') {
    let instructionText = "Use WASD or arrow keys to move. There are 5 articles of clothing. Stand on and click the clothes to wear them. You cannot wear blue and black together, they don't match. Press R to reset all clothes. Press I to toggle instructions";
    textSize(30 * screenSizer);
    text(instructionText, width/2, height/4, 1000 * screenSizer);
  }
}