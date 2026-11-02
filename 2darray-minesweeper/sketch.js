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

let offsetX;
let offsetY;


async function setup() {
  createCanvas(windowWidth, windowHeight);

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

    startTime: 0,
    gameStarted: false,
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
  offsetX = (width - cols*CELL_SIZE)/2;
  offsetY = (height - rows*CELL_SIZE)/2;
  
}

function draw() {
  background(255);

  managePlayers();
  
  if (partyIsHost() && game.player1Submitted && game.player2Submitted && !game.gameStarted) {
    game.gameStarted = true;
    game.startTime = Date.now();
  }

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
    //host is player 1
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
  console.log("Player number:", playerNumber);
  console.log("Mouse X:", mouseX);
  console.log("Mouse Y:", mouseY);

  if (currentPhase !== "placing" || submitted) {
  return;
  }
  if (mouseX > width/4 && mouseX < width/4 + 150 && mouseY > height/10 && mouseY < height/10 + 45) {
  submitBoard();
  return;
  }

  if (mouseX > width - width/4 && mouseX < width - width/4 + 150 && mouseY > height/10 && mouseY < height/10 + 45) {
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
  let x = Math.floor((mouseX - offsetX)/CELL_SIZE);
  let y = Math.floor((mouseY - offsetY)/CELL_SIZE);
  let currentBoard;
  let bombsPlaced;

  if (x<0 || x>=cols || y<0 || y>=rows) {
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
    if (!currentBoard[y]) continue;

    for (let x = 0; x < cols; x++) {
      if (currentBoard[y][x] === 0) {
        fill('white');
      }
      else if (currentBoard[y][x] === 1) {
        fill('red');
      }
      square(offsetX + x * CELL_SIZE, offsetY + y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function displaySubmitButton() {
  if (game) {
    fill("lightblue");
    rect(width/4, height/10, 150, 45);
  
    fill("black");
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Submit Board", width/4 + 70, height/10 + 25);
  }
}

function submitBoard() {
  if (playerNumber === 1) {
    game.player1Submitted = true;
  }
  else {
    game.player2Submitted = true;
  }

  submitted = true;

  console.log('Player', playerNumber, 'submitted');
}

function displayOpponentGrid() {
  let opponentBoard;

  if (playerNumber === 1) {
    opponentBoard = game.player2Grid;
  }
  else {
    opponentBoard = game.player1Grid;
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (opponentBoard[y][x] === 0) {
        fill("white");
      }
      else {
        fill("red");
      }
      square(offsetX + x * CELL_SIZE, offsetY + y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function bombModeChecker() {
  let bombText;
  if (game) {
    if (bombMode === 'placing') {
      fill('green');
      bombText = 'Place bombs';
    }
    else if (bombMode === 'removing') {
      fill('red')
      bombText = 'Remove bombs';
    }  
    rect(width - width/4, height/10, 150, 45);
    
    fill("black");
    textAlign(CENTER, CENTER);
    textSize(18);
    text(bombText, width - width/4 + 70, height/10 + 25);
  }
}

function startGameTimer() {
    if (game.gameStarted) {
      game.startTime = millis();

      fill('black');
      textSize(24);
      textAlign(CENTER, CENTER);
      text(round((Date.now() - game.startTime)/1000, 1), width/2, height/8);
  }
}