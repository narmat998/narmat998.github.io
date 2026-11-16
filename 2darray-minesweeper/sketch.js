// Project Title
// Your Name
// Oct 29, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let game = {};

const CELL_SIZE = 100;
let rows = 9;
let cols = 9;
let grid;

let bombCount;
let bombMode = 'placing';

let me;
let guests;
let playerNumber;

let submitted = false;
let currentPhase = 'placing';

let bombsPlaced;

async function setup() {
  let canvas = createCanvas(cols*CELL_SIZE, rows*CELL_SIZE);
  canvas.parent("canvas-container");

  await partyConnect(
    "wss://demoserver.p5party.org",
    "minesweeper_vs"
  );

  console.log('connected');

  game = await partyLoadShared("game", {
    player1Grid: generateRandomGrid(cols, rows),
    player2Grid: generateRandomGrid(cols, rows),

    player1Submitted: false,
    player2Submitted: false,

    player1BombsPlaced: 0,
    player2BombsPlaced: 0,  

    gameStarted: false,

    stopwatchStartTime: 0,
    elapsedTime: 0,
    isRunning: false,

    player1SolvedBoard: generateRandomGrid(cols, rows),
    player2SolvedBoard: generateRandomGrid(cols, rows),
  });

  me = await partyLoadMyShared({
    playerNumber: -1,
    submitted: false,
  });

  guests = partyLoadGuestShareds();

  console.log("Player 1 joined:", game.player1Joined);
  console.log("Player 2 joined:", game.player2Joined);

  console.log("game:", game);
 
  
  bombCount = 10;
  
}

function draw() {
  background(255);

  managePlayers();
  
  stopWatchManager();

  if (playerNumber === -1) {
    textSize(18);
    text("Joining game...", width/2, height/2);
    return;
  }
  
  if (playerNumber === 0) {
    textSize(18);
    text("Game is full!", width/2, height/2);
    return;
  }
  
  if (game.gameStarted === true)  {
    currentPhase = 'solving';
  }
  
  if (currentPhase === 'placing') {
    displayOwnGrid();
    displaySubmitButton();
  }
  
  else if (currentPhase === 'solving') {
    displayOpponentGrid();
    startGameTimer();
  }

  bombModeChecker();
}

function managePlayers() {

  if (partyIsHost()) {
    me.playerNumber = 1;

    //find the first guest
    let player2 = guests.find(player => player.playerNumber === 2);

    //find an unassigned guest
    let unassigned = guests.find(player => player.playerNumber === -1);

    //assign player 2
    if (!player2 && unassigned) {
      unassigned.playerNumber = 2;
    }

    //set everyone else to be a spectator
    for (let player of guests) {
      if (player.playerNumber === -1) {
        player.playerNumber = 0;
      }
    }
  }
  //player number to 1
  playerNumber = me.playerNumber;
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


function mousePressed() {
  if (currentPhase === "solving") {
    mineSweep();
    return;
  }

  console.log("Player number:", playerNumber);
  console.log("Mouse X:", mouseX);
  console.log("Mouse Y:", mouseY);

  if (currentPhase !== "placing" || submitted) {
    return;
  }

  if (mouseX > 0 && mouseX < 150 && mouseY > 0 && mouseY < 45 && bombsPlaced === bombCount) {
    submitBoard();
    
    return;
  }

  if (mouseX > width - 150 && mouseX < width && mouseY > 0 && mouseY < 45) {
    if (bombMode === 'placing') {
      bombMode = 'removing';
    }
    else if (bombMode === 'removing') {
      bombMode = 'placing';
    }
  }

  changeCell(bombMode);


}

function changeCell(bombMode) {
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);
  let currentBoard;

  if (x<0 || x>=cols || y<0 || y>=rows) {
    return;
  }
  if (mouseX > width - 150 && mouseX < width && mouseY > 0 && mouseY < 45) {
    return;
  }
  
  if (playerNumber === 1) {
    currentBoard = game.player1Grid;
    bombsPlaced = game.player1BombsPlaced;
  }
  else if (playerNumber === 2) {
    currentBoard = game.player2Grid;
    bombsPlaced = game.player2BombsPlaced;
  }
  else {
    return;
  }

  if (bombMode === 'placing') {
    if (currentBoard[y][x] === 0 && bombsPlaced < bombCount) {
      currentBoard[y][x] = 1;
      bombsPlaced++;
      console.log('player', playerNumber, 'placed bomb in square', x, y);
    }
  }
  else if (bombMode === 'removing') {
    if (currentBoard[y][x] === 1) {
      currentBoard[y][x] = 0;
      bombsPlaced--;
      console.log('player', playerNumber, 'removed bomb in square', x, y);
    }
  }

  if (playerNumber === 1) {
    game.player1BombsPlaced = bombsPlaced;
  }
  else if (playerNumber === 2) {
    game.player2BombsPlaced = bombsPlaced;
  }
}


function displayOwnGrid() {
  let currentBoard;
  
  if (!game) {
    console.log('game or grid is undefined');
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Loading...", width/2, height/2);
    return;
  }

  if (playerNumber === 1) {
    currentBoard = game.player1Grid;
  }
  else {
    currentBoard = game.player2Grid;
  }

  for (let y = 0; y < rows; y++) {
    if (!currentBoard[y]) {
      continue;
    }
    for (let x = 0; x < cols; x++) {
      if (currentBoard[y][x] === 0) {
        fill('white');
      }
      else if (currentBoard[y][x] === 1) {
        fill('red');
      }
      square(x * CELL_SIZE,y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function displaySubmitButton() {
  if (game) {
    fill("lightblue");
    rect(0, 0, 150, 45);
  
    fill("black");
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Submit Board", 70, 25);
  }
}

function displayOpponentGrid() {
  let opponentBoard;
  let solvedBoard;

  if (playerNumber === 1) {
    opponentBoard = game.player2Grid;
    solvedBoard = game.player1SolvedBoard;
  }

  else if (playerNumber === 2) {
    opponentBoard = game.player1Grid;
    solvedBoard = game.player2SolvedBoard;
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      fill("white");
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);

      if (solvedBoard[y][x] === 1) {
        let nearbyBombs = checkNearbyBombs(opponentBoard, x, y);

        if (nearbyBombs > 0) {
          fill("blue");
          text(nearbyBombs, x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
        }
      }
    }
  }
}

function submitBoard() {
  if (playerNumber === 1) {
    game.player1Submitted = true;
  }
  else if (playerNumber === 2) {
    game.player2Submitted = true;
  }

  submitted = true;

  console.log('Player', playerNumber, 'submitted');

  if (game.player1Submitted === true && game.player2Submitted === true) {
    currentPhase = 'solving';
    game.gameStarted = true;
  }
}

function bombModeChecker() {
  let bombText;
  if (game && !game.gameStarted) {
    if (bombMode === 'placing') {
      fill('green');
      bombText = 'Place bombs';
    }
    else if (bombMode === 'removing') {
      fill('red');
      bombText = 'Remove bombs';
    }  
    rect(width - 150, 0, 150, 45);
    
    fill("black");
    textAlign(CENTER, CENTER);
    textSize(18);
    text(bombText, width - 70, 25);
  }
}

function startGameTimer() {
  if (!game.isRunning) {
    return;
  }

  fill('black');
  textSize(24);
  textAlign(CENTER, CENTER);

  let seconds = (game.elapsedTime / 1000).toFixed(1);
  text(seconds, width/2, height/8);
}

function stopWatchManager() {
  //host starts the stopwatch
  if (partyIsHost()) {

    if (game.gameStarted && !game.isRunning) {
      game.stopwatchStartTime = Date.now();
      game.elapsedTime = 0;
      game.isRunning = true;
    }

    //the host updates elapsed time
    if (game.isRunning) {
      game.elapsedTime = Date.now() - game.stopwatchStartTime;
    }
  }
}

function mineSweep() {
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);

  let opponentBoard;
  let solvedBoard;

  //find the board thst belongs to the opponent
  if (playerNumber === 1) {
    opponentBoard = game.player2Grid;
    solvedBoard = game.player1SolvedBoard;
  } 
  else if (playerNumber === 2) {
    opponentBoard = game.player1Grid;
    solvedBoard = game.player2SolvedBoard;
  }
  else {
    return;
  }

  //check if click is inside the grid
  if (x < 0 || x >= cols || y < 0 || y >= rows) {
    return;
  }

  if (opponentBoard[y][x] === 1) {
    console.log("bomb");
  }

  else {
    solvedBoard[y][x] = 1;
    let nearbyBombs = checkNearbyBombs(opponentBoard, x, y);
    console.log('cell is touching', nearbyBombs, 'bombs');
  }
}

function checkNearbyBombs(board, x, y) {
  let bombTotal = 0;

  //check the 8 cells
  for (let yOffset = -1; yOffset <= 1; yOffset++) {
    for (let xOffset = -1; xOffset <= 1; xOffset++) {

      //ignore its own cell
      if (xOffset === 0 && yOffset === 0) {
        continue;
      }

      let checkX = x + xOffset;
      let checkY = y + yOffset;

      //if cell on edge
      if (checkX >= 0 && checkX < cols &&
          checkY >= 0 && checkY < rows) {

        if (board[checkY][checkX] === 1) {
          bombTotal++;
        }
      }
    }
  }

  return bombTotal;
}