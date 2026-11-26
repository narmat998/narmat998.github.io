//fireworks oop demo
const PARTICLES_PER_CLICK = 100;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random (-5, 5);
    this.dy = random(-5, 5);
    this.diameter = 5;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.opacity = 255; //255 is opaque, 0 is transparent
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.diameter);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.opacity -= 5;
  }

  checkParticleLife() {
    if (this.opacity === 0) {
      return true;
    }
    else {
      return false;
    }
  }
}

let fireworks = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  for (let firework of fireworks) {
    firework.display();
    firework.update();
    fireworkKiller();
  }
}

function mousePressed() {
  for (let i=0; i<PARTICLES_PER_CLICK; i++) {
    let someFirework = new Particle(mouseX, mouseY);
  
    fireworks.push(someFirework);
  }
}

function fireworkKiller() {
  for (let firework of fireworks) {
    if (firework.checkParticleLife()) {
      fireworks.shift();
    }
  }
}