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

let dudes = [];


async function setup() {
  createCanvas(windowWidth, windowHeight);
  for (i=0; i < 101; i++) {
    let dude;
    dude = new Walker(random(width), random(height), color(random(255), random(255), random(255)));

    dudes.push(dude);
  }
  noStroke();
}

function draw() {
  for (let i=0; i< dudes.length; i++) {
    dudes[i].move();
    dudes[i].display();
  }
}
