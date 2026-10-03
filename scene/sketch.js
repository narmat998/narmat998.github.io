// Interactive Scene
// Narayan Thibodeau
// October 2nd, 2026
//
// Extra for Experts:
// I used many sprites, and while somewhat inneficient, made specific outfits for each clothing item when equipped with others. 
// You cannot wear blue and black together, as they don't match, and you traverse the different "stages" to find all the clothes.
// The screen also scales along with the sprites and the variables.
// I have used the required state variables, and a nested for loop (for the confetti if you win)

let x;
let y;

let speed;

let stage;

let instructions = 'show';

let screenSizer;

let gameResult;

//outfits
let baseCharacter;
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

//static clothes state varaibles
let hair = 'show';
let shirt = 'show';
let bluePantsDisplayer = 'show';
let blackPantsDisplayer = 'show';
let blazerDisplayer = 'show';

//stacy variables
let stacySpeaking;
let showStacy;
let stacyText;

//setup
async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
  stage = 1;
  //set character startung position
  x = width/2;
  y = height*2/3;
  showStacy = 'show';

  //make the game scale according to the window size
  screenSizer  = windowHeight/1080;
  speed = 12 * screenSizer;

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

  //static clothes sprites
  blueShirtSprite = await loadImage('BLUESHIRT.png');
  bluePantsSprite = await loadImage('BLUEPANTS.png');
  blackPantsSprite = await loadImage('BLACKPANTS.png');
  blazerSprite = await loadImage('BLAZER.png');
  hairSprite = await loadImage('HAIR.png');

  baseCharacter = await loadImage("no_pants_no_shirt_(og).png");

  outfit = baseCharacter;

  //stacy sprites
  stacyIdle = await loadImage('girl_idle.png');
  stacySpeaking = await loadImage('girl_speaking.png')

}

//main draw loop
function draw() {
  stageTransitions();
  checkStage();
  makeStacy();
  makeClothes();
  makeCharacter();
  moveCharacter();
  makeInstructions();
  resultDetector();
}

//make the character exist
function makeCharacter() {
  image(outfit, x - 200 * screenSizer , y - 200 * screenSizer , 400 * screenSizer , 400 * screenSizer );
}

//make the character move if the game result isnt fail
function moveCharacter() {
  if (keyIsDown('w') && gameResult !== 'fail'|| keyIsDown(UP_ARROW) && gameResult !== 'fail') {
    y -= speed;
  }
  if (keyIsDown('s') && gameResult !== 'fail'|| keyIsDown(DOWN_ARROW) && gameResult !== 'fail') {
    y += speed;
  }

  if (keyIsDown('d') && gameResult !== 'fail'|| keyIsDown(RIGHT_ARROW) && gameResult !== 'fail') {
    x += speed;
  }
  if (keyIsDown('a') && gameResult !== 'fail'|| keyIsDown(LEFT_ARROW) && gameResult !== 'fail') {
    x -= speed;
  }
}

//make the stages look different
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

//if the character passes stage 1s boundaries he enters other stages. In the other stages, the character cannot pass the boundaries and has to go back the way he came.
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

// create the static clothes in their specfic stages
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
  // reset the character and put the clothes back
  if (key === 'r') {
    outfit = baseCharacter;
    shirt = 'show';
    hair = 'show';
    blackPantsDisplayer = 'show';
    bluePantsDisplayer = 'show';
    blazerDisplayer = 'show';
  }
  //toggle the instructions being visible
  if (key === 'i') {
    if (instructions === 'show') {
      instructions = 'hide';
    }
    else if (instructions === 'hide') {
      instructions = 'show';
    }
  }
  //if trying to talk to stacy, she decides if your outfit is good or not and returns a win or fail game result
  if (key === 'e') {
    if (stage === 1) {
      if (x > width - 400 * screenSizer && x < width && y > height - 400 * screenSizer && y < height) {
        showStacy = 'hide';
        shirt = 'hide';
        instructions = 'hide';
        if (outfit === suitHair1) {
          stacyText = "I love your outfit! Of course I'll go out with you!";
          gameResult = 'win';
        }
        else if (outfit === suit) {
          stacyText = "I mean, I love your outfit but... You're bald.";
          gameResult = 'fail';
        }
        else if (outfit === blueOnBlueHair1 || outfit === blueOnBlue) {
          stacyText = "Blue on blue is a choice I guess..."
          gameResult = 'fail';
        }
        else {
          stacyText = "Get away from me weirdo."
          gameResult = 'fail';
        }
      }
    }
  }
}

//if clicking on clothes and standing close enough to them, put them on. Unless it's blue on black.
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

//make the instructions appear
function makeInstructions() {
  if (instructions === 'show') {
    let instructionText = "Your goal is to dress well enough you get to go on a date with Stacy. Once you think your outfit is good enough, you have to go to Stacy and press E. Use WASD or arrow keys to move. There are 5 articles of clothing. Stand on and click the clothes to wear them. You cannot wear blue and black together, they don't match. Press R to reset all clothes. Press I to toggle instructions";
    textSize(30 * screenSizer);
    text(instructionText, width/2, height/5, 1000 * screenSizer);
  }
}

//create stacy. If you arent talking to her, put her in her "idle" state in the bottom left corner
function makeStacy() {
  if (stage === 1 && showStacy === 'show') {
    image(stacyIdle, width - 400 * screenSizer, height - 400 * screenSizer, 400 * screenSizer, 400 * screenSizer);
  }
  else if (stage === 1 && showStacy === 'hide') {
    image(stacySpeaking, width/4, height/4, 600 * screenSizer, 600 * screenSizer);
    textSize(30 * screenSizer);
    text(stacyText, width/4, height/5);
  }
}

//if you lose, you lose. If you win, you get confetti.
function resultDetector() {
  if (gameResult === 'fail') {
    textSize(50 * screenSizer);
    text('You failed to get Stacy.', width/4, height *6/7);
  }
  if (gameResult === 'win') {
    makeConfetti()
  }
}

//make confetti fall down across the screen
function makeConfetti() {
  for (let row = 0; row < 30; row++) {
    for (let col = 0; col < 40; col++) {

      let confettiX = col * (width / 20);

      //stagger the confetti every odd row
      if (row % 2 === 1) {
        confettiX += 20 * screenSizer;
      }

      let confettiY = (row * 60 + frameCount * 10) % height;

      fill(random(255), random(255), random(255));

      rect(confettiX, confettiY, 10 * screenSizer, 30 * screenSizer);
    }
  }
}