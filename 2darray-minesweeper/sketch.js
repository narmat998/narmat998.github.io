// Minesweeper vs
// Narayan Thibodeau
// Oct 29, 2026
//
// Extra for Experts:
//I used the p5.party library to create an online player vs player minesweeper game, I used the ternary operator, and made a randomly generated lobby code that the players can use to connect to a specific lobby,
//made shared game states that manage the boards, the switched boards, and made different boards and changed the colour of the cells using toggle buttons. 
//I also made a function that counds how many bombs a cell is touching, and one that reveals open cells like actual minesweeper.

//I used the same explosion code i used for my tank game but modified it to fit this game better
//I also referenced https://yay-inc.github.io/world/ on how to use p5party and the p5party library on how to assign players
//I left some of my debugging console messages just to make sure the player assignments work properly 
//I used basically the exact same 2d Array code that we used for the in class demo to make the base grid that can be altered by other functions
let game = {};

const CELL_SIZE = 100;
let rows = 9;
let cols = 9;
let grid;

let bombCount = 10;
let bombMode = 'placing';

let me;
let guests;
let playerNumber = -1;

let lobbyCode = '';
let lobbyJoined = false;
let menuScreen = true;
let joiningLobby = false;
let lobbyStatus = '';

let submitted = false;
let currentPhase = 'placing';

let bombsPlaced = 0;
let lobbyInput;

let localStart = 0;
let finalTime = 0;

let explosions = [];
let explosionStartTime = 0;
let explosionDelay = 1500;

let clickMode = 'sweeping';
let clickModeText = 'Sweeping';
let clickModeColor = 'red';


function setup() {
  let canvas = createCanvas(cols * CELL_SIZE, rows * CELL_SIZE);
  canvas.parent('canvas-container');

  textAlign(CENTER, CENTER);

  //make the lobby code input box
  lobbyInput = createInput('');
  lobbyInput.attribute('placeholder', 'Enter 6-digit code');
  lobbyInput.attribute('maxlength', '6');
  lobbyInput.style('width', '180px');
  lobbyInput.position(windowWidth/2 - 100, height*3/4);
  lobbyInput.style('padding', '10px');
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

  if (code >= 100000 && code <= 999999) {
    lobbyCode = code;
    await connectToLobby();
  }
  else {
    lobbyStatus = 'Incorrect lobby code';
    return;
  }
}


async function connectToLobby() {
  joiningLobby = true;
  lobbyStatus = 'Connecting...';

  try {
    await partyConnect(
      'wss://demoserver.p5party.org',
      'minesweeper_vs',
      lobbyCode
    );

    console.log('Connected to lobby:', lobbyCode);

    game = await partyLoadShared('game', {
      player1Grid: generateGrid(cols, rows),
      player2Grid: generateGrid(cols, rows),

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

      winner: 0,
      finalTime: 0,
      
      player1SolvedBoard: generateGrid(cols, rows),
      player2SolvedBoard: generateGrid(cols, rows)
    });
    
    me = await partyLoadMyShared({
      playerNumber: -1,
      submitted: false
    });
    
    guests = partyLoadGuestShareds();
    
    lobbyJoined = true;
    menuScreen = false;
    lobbyStatus = 'Connected';
    
    lobbyInput.hide();
    
    console.log('Game:', game);
  }
  catch (error) {
    console.error('Lobby connection failed:', error);
    lobbyStatus = 'Connection failed';
  }
  joiningLobby = false;
}


function displayLobbyMenu() {
  //menu screen with the create lobby/ join lobby buttons and the lobby code input 
  background(40);
  
  fill('white');
  textAlign(CENTER, CENTER);
  
  textSize(40);
  text('MINESWEEPER VS', width/2, 150);
  
  fill('lightgreen');
  rect(width/2 - 125, 230, 250, 60);
  
  fill(0);
  textSize(22);
  text('Create Lobby', width/2, 260);
   
  fill('lightblue');
  rect(width/2 - 125, 320, 250, 60);
  
  fill(0);
  text('Join Lobby', width/2, 350);
  
  fill('white');
  textSize(16);
  text(lobbyStatus, width/2, 420);
  
  if (lobbyInput) {
    lobbyInput.show();
  }
}


function displayWaitingRoom() {
  //the waiting room after a code is put in waiting for the other player to join
  background(40);

  fill('white');
  textAlign(CENTER, CENTER);

  textSize(32);
  text('Lobby Code:', width/2, 120);

  textSize(42);
  fill('lightgreen');
  text(lobbyCode, width/2, 200);

  textSize(20);
  fill('white');

  text('Player 1: ' + (game.player1Joined ? 'Connected' : 'Waiting'), width/2, 300);
  text('Player 2: ' + (game.player2Joined ? 'Connected' : 'Waiting'), width /2, 350);

  if (game.player1Joined && game.player2Joined) {
    fill('lightgreen');
    text('Both players connected', width / 2, 430);
  }
  else {
    fill('yellow');
    text('Waiting for opponent to connect', width / 2, 430);
  }
}


function draw() {
  if (menuScreen) {
    //if menu screen, show menu screen
    displayLobbyMenu();
    return;
  }

  if (!lobbyJoined || !game) {
    //if the game isn't started make the lobby grey
    background(40);
    return;
  }  
  
  if (game.winner !== 0) {
    //if you hit a bomb the grid still needs to exist until the delay is complete
    background('white');
    displayOpponentGrid();

    updateExplosions();
    //wait for explosion delay
    if (millis() - explosionStartTime >= explosionDelay) {
      endGame(game.winner);
    }
    return;
  }

  //otherwise make the background white
  background('white');

  //manage the player numbesr
  managePlayers();

  if (playerNumber === 0) {
    //if both players have joined the lobby, show a lobby is full screen to extra people 
    background(40)
    textAlign(CENTER, CENTER)
    textSize(30);
    fill('white');
    text('Lobby is full', width/2, height/2);
    return;
  }

  if (!game.player1Joined || !game.player2Joined) {
    //if missing a player display the waiting room
    displayWaitingRoom();
    return;
  }

  if (game.gameStarted === true) {
    //if the game is started, the current phase is solving. if not started, then the current phase is still placing
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
    //if the current phase is solving show the opponents bomb data, show the flagging/sweeping toggle button, the stopwatch and check for a winner
    displayOpponentGrid();
    displayFlagClick();
    stopWatchManager();
    displayStopwatch();
    checkWinner();
  }

  //toggle between placing and removing bombs
  bombModeChecker();
}


function managePlayers() {
  //if the player has not joined the lobby, the game is undefined, or the players data doesnt exist, return
  if (!lobbyJoined || !game || !me)  {
    return;
  }

  //check if the player is the host
  if (partyIsHost()) {
    //assign player 1
    me.playerNumber = 1;
    //set the shared game variable to let player 1 exist
    game.player1Joined = true;
    
    //search through the guests array to see if player 2 has already been assigned
    let player2 = guests.find(player => player.playerNumber === 2);

    //if player 2 is unassigned find a person who has joined the lobby and been assigned -1, and mkae them player 2
    if (!player2) {
      let unassigned = guests.find(player => player.playerNumber === -1);

      //if an unassigned player was found, assign them player 2 and set the shared game variable to let player 2 exist
      if (unassigned) {
        unassigned.playerNumber = 2;
        game.player2Joined = true;
        console.log('Player 2 joined');
      }
    }

    for (let player of guests) {
      //if there is an unassigned player but player 2 has already been assigned, don't let then join
      if (player.playerNumber === -1 && game.player2Joined) {
        player.playerNumber = 0;
      }
    }
  }
  //assign the local player number
  playerNumber = me.playerNumber;
}


function generateGrid(cols, rows) {
  //make the grid
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
    //create a lobby if the click is in the area of the create lobby rectangle
    if (mouseX > width / 2 - 125 && mouseX < width / 2 + 125 && mouseY > 230 && mouseY < 290) {
      createLobby();
      return;
    }
    //try to join a lobby using the code in the lobby input if the click is in the area of the join lobby rectangle
    if (mouseX > width / 2 - 125 && mouseX < width / 2 + 125 && mouseY > 320 && mouseY < 380) {
      let code = lobbyInput.value();
      joinLobby(code);
      return;
    }
    return;
  }

  //solving the grid
  if (currentPhase === 'solving') {
    //toggle flagging and sweeping if you click in the area of the "button"
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

    //if you click in the area of the submit button and all bombs have been placed
    if (mouseX > 0 && mouseX < 150 && mouseY > 0 && mouseY < 45 && bombsPlaced === bombCount) {
      submitBoard();
      return;
    }

    //toggle placing and removing bombs if the click is in the area of the "button"
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

  //if outside of grid ignore
  if (x<0 || x>=cols || y<0 || y>=rows) {
    return;
  }
  if (mouseX > width - 150 && mouseX < width && mouseY > 0 && mouseY < 45) {
    return;
  }
  
  //assign the boards 
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

  //if a bomb is placed add 1 to the bombcount
  if (bombMode === 'placing') {
    if (currentBoard[y][x] === 0 && bombsPlaced < bombCount) {
      currentBoard[y][x] = 1;
      bombsPlaced++;
      console.log('player', playerNumber, 'placed bomb in square', x, y);
    }
  }
  //if a bomb is removed subtract 1 from the bombcount
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
  
  //if the game is undefined
  if (!game) {
    console.log('game or grid is undefined');
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text('Loading...', width/2, height/2);
    return;
  }

  //assign the current board to the correct player
  if (playerNumber === 1) {
    currentBoard = game.player1Grid;
  }
  else {
    currentBoard = game.player2Grid;
  }

  //if the cell is a bomb make it red, if not make it white
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
  //make the submit buton for when you are placing the bombs
  if (game) {
    fill('lightblue');
    rect(0, 0, 150, 45);
  
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(18);
    text('Submit Board', 70, 25);
  }
}


function displayOpponentGrid() {
  //show the opponents board with their bomb placements but make them white 
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

  //if you have clicked the square make it gray, if it is unclicked make it white, if it is flagged make it orange.
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (solvedBoard[y][x] === 1) {
        fill('gray');
      }
      else if(solvedBoard[y][x] === 0){
        fill('white');
      }
      else if(solvedBoard[y][x] === 2) {
        fill('orange');
      }

      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);

      //if the cell is clicked, check the nearby bombs, and say how many are nearby
      if (solvedBoard[y][x] === 1) {
        let nearbyBombs = checkNearbyBombs(opponentBoard, x, y);
        if (nearbyBombs > 0) {
          fill('blue');
          text(nearbyBombs, x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
        }
      }
    }
  }
}


function submitBoard() {
  //track if the players have submitted, and if they have both submitted their boards, start the game and set the current phase to solving
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
  //place or remove bombs if the game is defined and the game isn't started
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
    
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(18);
    text(bombText, width - 70, 25);
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

  //make sure the boards exist yet
  if (!opponentBoard || !solvedBoard || !solvedBoard[y] || !opponentBoard[y]) {
    console.log('boards not ready', opponentBoard, solvedBoard);
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
      explode(x, y);

      //set the winner to whoever didnt hit the bomb
      if (playerNumber === 1) {
        game.winner = 2;
      }
      else if (playerNumber === 2) {
        game.winner = 1;
      } 

      //set when the explosion started 
      explosionStartTime = millis();

      //set the final time
      game.finalTime = (millis() - localStart) / 1000;
    }
    else {
      revealCells(opponentBoard, solvedBoard, x, y);
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


function revealCells(opponentBoard, solvedBoard, startX, startY) {
  let surroundingCells = [[startX, startY]];

  while (surroundingCells.length > 0) {
    let [x, y] = surroundingCells.pop();

    //if outside the grid ignore the cell
    if (x < 0 || x >= cols || y < 0 || y >= rows) {
      continue;
    }

    //don't reveal cells that are already revealed, flagged, or bombs
    if (solvedBoard[y][x] !== 0 || opponentBoard[y][x] === 1) {
      continue;
    }
    //make it a revealed cell
    solvedBoard[y][x] = 1;

    //spread outward from cells with no nearby bombs
    if (checkNearbyBombs(opponentBoard, x, y) === 0) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        for (let xOffset = -1; xOffset <= 1; xOffset++) {
          if (xOffset !== 0 || yOffset !== 0) {
            surroundingCells.push([x + xOffset, y + yOffset]);
          }
        }
      }
    }
  }
}

  
function displayFlagClick() {
  //make the flagging/sweeping button 
  fill(clickModeColor);
  rect(width/2 - 75, 0, 150, 40);
    
  fill('white');
  textSize(18);
  textAlign(CENTER, CENTER);
  text(clickModeText, width/2, 20);
}
  

function stopWatchManager() {
  //host sets the start time
  if (partyIsHost() && !game.gameStarted) {
    game.stopwatchStartTime = Date.now();
  }
  //each player gets their local start and starts when they see the game is started
  if (game.gameStarted && localStart === 0) {
    localStart = millis();
  }
}
  
  
function displayStopwatch() {
  //show the stopwatch in the corner
  if (localStart === 0) return;
  let seconds = ((millis() - localStart) / 1000).toFixed(1);

  fill('white');
  rect(width - 150, 0, 150, 40);
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(seconds, width - 75, 20);
}


function checkWinner() {
  //if a winner has been found, return
  if (game.winner !== 0) {
    return;
  }
  if (currentPhase === 'solving') {
    let opponentBoard;
    let solvedBoard;

    //assign the boards 
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

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let bomb = opponentBoard[y][x] === 1;
        let flag = solvedBoard[y][x] === 2;

      //if there are flags on non bomb cells return false,
        if (bomb !== flag) {
          return false;
        }
      }
    }
    //if all the bombs are flagged set the winner to be the player and save the final time
  game.winner = playerNumber;
  game.finalTime = (millis()-localStart)/ 1000;
  }
}


function endGame(winningPlayer) {
  //show the end screen with the winner and their time
  background(40);

  fill('yellow');
  textAlign(CENTER, CENTER);
  textSize(45);
  text('PLAYER '+ winningPlayer + ' WON', width/2, height/2 -100);

  text('WITH A TIME OF ' + game.finalTime.toFixed(1) + ' SECONDS', width/2, height/2);
}


function explode(x, y) {
  let explosionX = x * CELL_SIZE + CELL_SIZE / 2;
  let explosionY = y * CELL_SIZE + CELL_SIZE / 2;
  //make `100 circles that operate like bomb fragments
  for (let i = 0; i < 50; i++) {
    explosions.push({
      x: explosionX,
      y: explosionY,
      velocityX: random(-10, 10),
      velocityY: random(-10, 10),
      radius: random(3, 40),
      life: 60,
    });
  }
}


function updateExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    let fragment = explosions[i];

    //move fragment
    fragment.x += fragment.velocityX;
    fragment.y += fragment.velocityY;
    fragment.life-- ;

    //randomly colour the circles
    fill(random(0, 255), random(0, 255), random(0, 255));
    noStroke();
    circle(fragment.x, fragment.y, fragment.radius * fragment.life /60);

    //if the fragment has existed for its lifespan get rid of it
    if (fragment.life <= 0) {
      explosions.splice(i, 1);
    }
  }
}