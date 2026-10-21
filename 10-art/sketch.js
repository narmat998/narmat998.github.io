// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let theTiles = [];

const THE_SIZE = 2;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let y = 0; y<=height; y+= THE_SIZE) {
    for (let x = 0; x <= width; x+= THE_SIZE) {
      let someTile = spawnTile(x, y, THE_SIZE);
      theTiles.push(someTile);
    }
  }
}

function draw() {
  background(220);
  for (let theTile of theTiles) {
    line(theTile.x1, theTile.y1, theTile.x2, theTile.y2);
  }
}


function spawnTile(x, y, tileSize) {
  let choice = random(100);
  let tile;
  if (choice < 50) {
    tile = {
      x1: x + tileSize,
      y1: y - tileSize,
      x2: x - tileSize,
      y2: y + tileSize,
    };
  }

  else {
    tile = {
      x1: x - tileSize,
      y1: y - tileSize,
      x2: x + tileSize,
      y2: y + tileSize,
    };
  }

  return tile;
}