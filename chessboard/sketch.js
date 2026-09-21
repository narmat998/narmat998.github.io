let space;
let dimensions;

function setup() {
  if (windowWidth > windowHeight){
    createCanvas(windowHeight, windowHeight);
    dimensions = windowHeight;
  }
  else {
    createCanvas(windowWidth, windowWidth);
    dimensions = windowWidth;
  }
  
  noStroke()
  space = dimensions/8;
  x = 0;
}

function draw() {
  background('white');
  chessboard()
}

function chessboard() {
  let size = width/8;
  for (let x = 0, x < 8, x++) {
     for (let y = 0, y < 8, y++)
  }
  rect('')
  for (let x = 0; x <= dimensions; x += dimensions/4) {
    for (let y = dimensions/8; y <= dimensions; y += dimensions/4) {
      fill(0);
      rect(x, y, space, space);
      rect(x + dimensions/8, y - dimensions/8, space, space);
    }
  }
}