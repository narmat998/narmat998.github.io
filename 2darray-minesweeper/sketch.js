// Project Title
// Your Name
// Oct 29, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CELL_SIZE = 100;
let rows;
let cols;
let grid;

let bombCount;

async function setup() {
  createCanvas(windowHeight, windowHeight);
  rows = Math.floor(height/CELL_SIZE);
  cols = Math.floor(width/CELL_SIZE);
  bombCount = 10;
  grid = generateRandomGrid(cols, rows);
  generateBombCoordinates();

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
  for (let y=0; y<rows; y++) {
    for (let x=0; x<cols; x++) {
      if (grid[y][x] === 0) {
        fill('white');
      }
      else if (grid[y][x] === 1) {
        fill('red');
      }
      square(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE);
    }
  }
}

function generateBombCoordinates() {
  let bombsPlaced = 0;

  while (bombsPlaced < bombCount) {
    let x = Math.floor(random(cols));
    let y = Math.floor(random(rows));

    if (grid[y][x] === 0) {
      grid[y][x] = 1;
      bombsPlaced++;
    }
  }
}