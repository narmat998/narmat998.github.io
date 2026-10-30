// Project Title
// Your Name
// Oct 29, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

document.addEventListener('contextmenu', function (e) {e.preventDefault();});

let game = {};

const CELL_SIZE = 100;
let rows = 9;
let cols = 9;
let grid;

let bombCount;
let bombsPlaced = 0;

let offsetX;
let offsetY;

function preload() {
  // connect to a p5party server
  partyConnect(
    "wss://demoserver.p5party.org", 
    "minesweeper_vs"
  );
  game = partyLoadShared("game", {
    grid: generateRandomGrid(cols, rows),
    bombsPlaced: 0,
  });

}

async function setup() {
  createCanvas(windowWidth, windowHeight);
 
  
  bombCount = 10;
  offsetX = (width - cols*CELL_SIZE)/2;
  offsetY = (height - rows*CELL_SIZE)/2;
  
}

function draw() {
  background(255);
  displayGrid();
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for ( let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x< cols; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}

function displayGrid() {
  if (!game || !game.grid) {
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Loading...", width/2, height/2);
    return;
  }

  for (let y = 0; y < rows; y++) {
    if (!game.grid[y]) continue;

    for (let x = 0; x < cols; x++) {
      if (game.grid[y][x] === 0) {
        fill('white');
      }
      else if (game.grid[y][x] === 1) {
        fill('red');
      }
      square(offsetX + x * CELL_SIZE, offsetY + y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function mousePressed() {
  let x = Math.floor((mouseX - offsetX)/CELL_SIZE);
  let y = Math.floor((mouseY - offsetY)/CELL_SIZE);
  
  if (mouseButton === LEFT) {
    if (game.grid[y][x] === 0 && game.bombsPlaced < bombCount) {
      game.grid[y][x] = 1;
      game.bombsPlaced++
    }
  }
  
  else if (mouseButton === RIGHT) {
    if (game.grid[y][x] === 1) {
      game.grid[y][x] = 0;
      game.bombsPlaced--
    }
  }
}


// function generateBombCoordinates() {
//   let game.bombsPlaced = 0;

//   while (game.bombsPlaced < bombCount) {
//     let x = Math.floor(random(cols));
//     let y = Math.floor(random(rows));

//     if (game.grid[y][x] === 0) {
//       game.grid[y][x] = 1;
//       game.bombsPlaced++;
//     }
//   }
// }