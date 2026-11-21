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

let bombCount = 3;
let bombMode = "placing";

let me;
let guests;
let playerNumber = -1;

let lobbyCode = "";
let lobbyJoined = false;
let menuScreen = true;
let joiningLobby = false;
let lobbyStatus = "";

let submitted = false;
let currentPhase = "placing";

let bombsPlaced = 0;
let lobbyInput;

let clickMode = 'sweeping';
let clickModeText = 'Sweeping';
let clickModeColor = 'red';

function setup() {
  let canvas = createCanvas(cols * CELL_SIZE, rows * CELL_SIZE);
  canvas.parent("canvas-container");

  textAlign(CENTER, CENTER);

  //make the lobby code input box
  lobbyInput = createInput("");
  lobbyInput.attribute("placeholder", "Enter 6-digit code");
  lobbyInput.attribute("maxlength", "6");
  lobbyInput.style("width", "180px");
  lobbyInput.position(windowWidth/2 - 100, height*3/4);
  lobbyInput.style("padding", "10px");
  lobbyInput.hide();
}

function generateLobbyCode() {
  return Math.floor(Math.random() * 900000) + 100000;
}

async function createLobby() {
  if (joiningLobby || lobbyJoined) {
    return;
  }

  lobbyCode = generateLobbyCode().toString();
  await connectToLobby();
}

async function joinLobby(code) {
  if (joiningLobby || lobbyJoined) {
    return;
  }
  code = code.trim();

  if (code > 100000 && code < 999999) {
    lobbyCode = code;
    await connectToLobby();
  }
  else {
    lobbyStatus = "Incorrect lobby code";
    return;
  }
}

async function connectToLobby() {
  joiningLobby = true;
  lobbyStatus = "Connecting...";

  try {
    await partyConnect(
      "wss://demoserver.p5party.org",
      "minesweeper_vs",
      lobbyCode
    );

    console.log("Connected to lobby:", lobbyCode);

    game = await partyLoadShared("game", {
      player1Grid: generateRandomGrid(cols, rows),
      player2Grid: generateRandomGrid(cols, rows),

      player1Submitted: false,
      player2Submitted: false,

      player1BombsPlaced: 0,
      player2BombsPlaced: 0,

      player1Joined: false,
      player2Joined: false,

      gameStarted: false,

      stopwatchStartTime: 0,
      elapsedTime: 0,
      isRunning: false,
      
      player1SolvedBoard: generateRandomGrid(cols, rows),
      player2SolvedBoard: generateRandomGrid(cols, rows)
    });
    
    me = await partyLoadMyShared({
      playerNumber: -1,
      submitted: false
    });
    
    guests = partyLoadGuestShareds();
    
    lobbyJoined = true;
    menuScreen = false;
    lobbyStatus = "Connected";
    
    lobbyInput.hide();
    
    console.log("Game:", game);
  }
  catch (error) {
    console.error("Lobby connection failed:", error);
    lobbyStatus = "Connection failed";
  }
  joiningLobby = false;
}

function displayLobbyMenu() {
  background(40);
  
  fill(255);
  textAlign(CENTER, CENTER);
  
  textSize(40);
  text("MINESWEEPER VS", width/2, 150);
  
  fill("lightgreen");
  rect(width/2 - 125, 230, 250, 60);
  
  fill(0);
  textSize(22);
  text("Create Lobby", width/2, 260);
   
  fill("lightblue");
  rect(width/2 - 125, 320, 250, 60);
  
  fill(0);
  text("Join Lobby", width/2, 350);
  
  fill(255);
  textSize(16);
  text(lobbyStatus, width/2, 420);
  
  if (lobbyInput) {
    lobbyInput.show();
  }
}

function displayWaitingRoom() {
  background(40);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(32);
  text("Lobby Code:", width/2, 120);

  textSize(42);
  fill("lightgreen");
  text(lobbyCode, width/2, 200);

  textSize(20);
  fill(255);

  text("Player 1: " + (game.player1Joined ? "Connected" : "Waiting"), width/2, 300);

  text("Player 2: " + (game.player2Joined ? "Connected" : "Waiting"), width /2, 350);

  if (game.player1Joined && game.player2Joined) {
    fill("lightgreen");
    text("Both players connected!", width / 2, 430);
  }
  else {
    fill("yellow");
    text("Waiting for opponent...", width / 2, 430);
  }
}


function draw() {
  if (menuScreen) {
    displayLobbyMenu();
    return;
  }

  if (!lobbyJoined || !game) {
    background(40);
    return;
  }  

  background(255);

  managePlayers();
  startGameTimer();

  if (playerNumber === -1) {
    textSize(18);
    fill(0);
    text("Joining game...", width/2, height/2);
    return;
  }

  if (playerNumber === 0) {
    textSize(18);
    fill(0);
    text("Lobby is full!", width/2, height/2 );
    return;
  }

  if (!game.player1Joined || !game.player2Joined) {
    displayWaitingRoom();
    return;
  }

  if (game.gameStarted === true) {
    currentPhase = 'solving';
  }
  else {
    currentPhase = 'placing';
  }
 
  if (currentPhase === 'placing') {
    displayOwnGrid();
    displaySubmitButton();
  }
  
  else if (currentPhase === 'solving') {
    displayOpponentGrid();
    displayFlagClick();
    stopWatchManager();
  }

  bombModeChecker();
}

function managePlayers() {
  if (!lobbyJoined || !game || !me)  {
    return;
  }

  if (partyIsHost()) {
    me.playerNumber = 1;
    game.player1Joined = true;
    let player2 = guests.find(player => player.playerNumber === 2);

    if (!player2 && !game.gameStarted) {
      let unassigned = guests.find(player => player.playerNumber === -1);

      if (unassigned) {
        unassigned.playerNumber = 2;
        game.player2Joined = true;
        console.log("Player 2 joined!");
      }
    }
    //dont let extra players in
    for (let player of guests) {
      if (player.playerNumber === -1 && game.player2Joined) {
        player.playerNumber = 0;
      }
    }
  }
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
  if (menuScreen) {
    if (mouseX > width / 2 - 125 && mouseX < width / 2 + 125 && mouseY > 230 && mouseY < 290) {
      createLobby();
      return;
    }

    if (mouseX > width / 2 - 125 && mouseX < width / 2 + 125 && mouseY > 320 && mouseY < 380) {
      let code = lobbyInput.value();
      joinLobby(code);
      return;
    }
    return;
  }

  if (!lobbyJoined || playerNumber < 1) {
    return;
  }

  //solving the girds
  if (currentPhase === "solving") {
    //toggle flagging and sweeping
    if (mouseX > width/2 - 75 && mouseX < width/2 + 75 && mouseY > 0 && mouseY < 40) {
      if (clickMode === 'sweeping') {
        clickMode = 'flagging';
        clickModeText = 'Flagging';
        clickModeColor = 'green';
      }
      else if (clickMode === 'flagging') {
        clickMode = 'sweeping';
        clickModeText = 'Sweeping';
        clickModeColor = 'red';
      }
      return;
    }
    mineSweep();
    return;
  }
  
  //if placing bombs
  if (currentPhase === 'placing') {
    if (submitted === true) {      
      return;
    }

    if (mouseX > 0 && mouseX < 150 && mouseY > 0 && mouseY < 45 && bombsPlaced === bombCount) {
      submitBoard();
      return;
    }

    //toggle placing and removing
    if (mouseX > width - 150 && mouseX < width && mouseY > 0 && mouseY < 45) {
      if (bombMode === 'placing') {
        bombMode = 'removing';
      }
      else {
        bombMode = 'placing';
      }
      return;
    }
  changeCell(bombMode);
  }
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
      if (solvedBoard[y][x] === 1) {
        fill("gray");
      }
      else if(solvedBoard[y][x] === 0){
        fill("white");
      }

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
  //make host start stopwatch so no error with browser stuff
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

  //flagging
  if (clickMode === 'flagging') {
    if (solvedBoard[y][x] === 0) {
      solvedBoard[y][x] = 2;
    }
    else if (solvedBoard[y][x] === 2) {
      solvedBoard[y][x] = 0;
    }
    return;
  }


  //sweeping
  if (clickMode === 'sweeping') {
    if (solvedBoard[y][x] === 2) {
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

function displayFlagClick() {
  fill(clickModeColor);
  rect(width/2 - 75, 0, 150, 40);

  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(clickModeText, width/2, 20);
}