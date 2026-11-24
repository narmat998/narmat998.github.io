//walker OOP demo


class Walker{
  constructor(x, y, colour) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.colour = colour;
    this.diameter = 5;
  }
  
  display() {
    fill(this.colour);
    circle(this.x, this.y, this.diameter);
  }

  move() {
    let choice = random(0, 100);
    if (choice < 25) {
      this.y -= this.speed;
    }
    else if(choice < 50) {
      this.y += this.speed;
    }
    else if(choice<75) {
      this.x -= this.speed;
    }
    else {
      this.x += this.speed;
    }
  }
}

let walkers = [];

let walk = true;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  for (let i=0; i<walkers.length; i++) {
    if (walk === true) {
      walkers[i].move();
      walkers[i].display();
    }
  }

  spawnWalker();
}

function mousePressed() {
  walk = !walk;
}

function spawnWalker() {
  let someWalker = new Walker(mouseX, mouseY, color(random(255), random(255), random(255)));
  
  walkers.push(someWalker);
  
}