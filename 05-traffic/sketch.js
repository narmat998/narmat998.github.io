// Traffic Light Starter Code
// Your Name Here
// The Date Here

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis


const GREEN = 'green';
const YELLOW = 'yellow';
const RED = 'red';

let greenTime= 5000;
let yellowTime = 1000;
let redTime = 3000;


let waitTime = 1000;
let swapTime = 0;
let state = RED;


async function setup() {
  createCanvas(600, 600);
  fill('green');
  ellipse(width/2, height/2 + 65, 50, 50); //top
}

function draw() {
  background(255);
  drawOutlineOfLights();
  chooseLight();
  
  changeColours();
}

function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(0);
  rect(width/2, height/2, 75, 200, 10);

  //lights
  fill(255);
  ellipse(width/2, height/2 - 65, 50, 50); //top
  ellipse(width/2, height/2, 50, 50); //middle
  ellipse(width/2, height/2 + 65, 50, 50); //bottom
}



function changeColours() {
  if (state === GREEN && millis() >= swapTime + greenTime) {
    state = YELLOW;
    swapTime = millis();

  }
  else if (state === YELLOW && millis() >= swapTime + yellowTime) {
    state = RED;
    swapTime = millis();
  }
  else if (state === RED && millis() >= swapTime + redTime) {
    state = GREEN;
    swapTime = millis();
  }

}


function chooseLight() {
  if (state === GREEN) {
    fill('green');
    ellipse(width/2, height/2 + 65, 50, 50); //bottom
  }
  else if (state === YELLOW) {
    fill('yellow');
    ellipse(width/2, height/2, 50, 50); //middle
  }
  else if (state === RED) {
    fill('red');
    ellipse(width/2, height/2 - 65, 50, 50); //top
  }
  
}