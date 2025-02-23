const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-piece');
const nextCtx = nextCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');

const boardWidth = 12;
const boardHeight = 20;
const blockSize = 20;

const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    updateGame(); 
});

canvas.width = boardWidth * blockSize;
canvas.height = boardHeight * blockSize;
nextCanvas.width = 80;
nextCanvas.height = 80;

const colors = [
  null,
  'cyan',
  'blue',
  'orange',
  'yellow',
  'green',
  'purple',
  'red'
];

const shapes = [
  null,
  [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
  [[0, 2, 2], [0, 2, 0], [0, 2, 0]],
  [[0, 3, 3], [0, 0, 3], [0, 0, 3]],
  [[4, 4], [4, 4]],
  [[0, 5, 5], [5, 5, 0]],
  [[0, 6, 0], [6, 6, 6]],
  [[7, 7, 0], [0, 7, 7]]
];

let board = createBoard();
let currentPiece = createRandomPiece();
let nextPiece = createRandomPiece();
let positionX = 0;
let positionY = 0;
let score = 0;
let level = 1;
let speed = 500;
let lastTime = 0;

function createBoard() {
  const board = [];
  for (let y = 0; y < boardHeight; y++) {
    board[y] = Array(boardWidth).fill(0);
  }
  return board;
}

function createRandomPiece() {
  const pieceNumber = Math.floor(Math.random() * (shapes.length - 1)) + 1;
  const piece = shapes[pieceNumber];
  return { piece, color: pieceNumber };
}

function drawBlock(ctx, x, y, color) {
  ctx.fillStyle = colors[color];
  ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      if (board[y][x]) {
        drawBlock(ctx, x, y, board[y][x]);
      }
    }
  }
}

function drawPiece() {
  currentPiece.piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(ctx, positionX + x, positionY + y, currentPiece.color);
      }
    });
  });
}

function drawNextPiece() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  nextPiece.piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(nextCtx, x + 1, y + 1, nextPiece.color);
      }
    });
  });
}

function mergePiece() {
  currentPiece.piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[positionY + y][positionX + x] = currentPiece.color;
      }
    });
  });
}

function clearFullRows() {
  let rowsCleared = 0;
  for (let y = boardHeight - 1; y >= 0; y--) {
    if (board[y].every(value => value)) {
      board.splice(y, 1);
      board.unshift(Array(boardWidth).fill(0));
      rowsCleared++;
    }
  }
  if (rowsCleared > 0) {
    score += [0, 40, 100, 300, 1200][rowsCleared] * level;
    scoreDisplay.textContent = score;
    if (score >= level * 1000) {
      level++;
      levelDisplay.textContent = level;
      speed *= 0.9;
    }
  }
}

function collision(x, y, piece) {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col]) {
        const newX = x + col;
        const newY = y + row;
        if (newX < 0 || newX >= boardWidth || newY >= boardHeight || board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

function movePieceDown() {
  if (!collision(positionX, positionY + 1, currentPiece.piece)) {
    positionY++;
  } else {
    mergePiece();
    clearFullRows();
    currentPiece = nextPiece;
    nextPiece = createRandomPiece();
    drawNextPiece();
    positionX = Math.floor(boardWidth / 2) - Math.floor(currentPiece.piece[0].length / 2);
    positionY = 0;
    if (collision(positionX, positionY, currentPiece.piece)) {
      board = createBoard();
      score = 0;
      level = 1;
      speed = 500;
      scoreDisplay.textContent = score;
      levelDisplay.textContent = level;
    }
  }
}

function movePieceHorizontal(direction) {
  const newX = positionX + direction;
  if (!collision(newX, positionY, currentPiece.piece)) {
    positionX = newX;
  }
}

function rotatePiece(direction) {
  const originalPiece = currentPiece.piece;
  const rotatedPiece = originalPiece[0].map((val, index) => originalPiece.map(row => row[index]).reverse());
  if (direction === -1) {
    rotatedPiece.forEach(row => row.reverse());
  }
  if (!collision(positionX, positionY,rotatedPiece)) {
    currentPiece.piece = rotatedPiece;
  }
}

document.addEventListener('keydown', event => {
  switch (event.keyCode) {
    case 37: // Left
      movePieceHorizontal(-1);
      break;
    case 39: // Right
      movePieceHorizontal(1);
      break;
    case 40: // Down (soft drop)
      movePieceDown();
      break;
    case 90: // Z (rotate counter-clockwise)
      rotatePiece(-1);
      break;
    case 88: // X (rotate clockwise)
      rotatePiece(1);
      break;
  }
});

function updateGame(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  if (deltaTime > speed) {
    movePieceDown();
    lastTime = time;
  }
  drawBoard();
  drawPiece();
  requestAnimationFrame(updateGame);
}

lastTime = performance.now(); // Initialize lastTime with current time

function updateGame(time = performance.now()) { // Use performance.now() for accurate timing
  const deltaTime = time - lastTime;

  if (deltaTime > speed) {
    movePieceDown();
    lastTime = time - (deltaTime % speed); // Correct lastTime update
  }

  drawBoard();
  drawPiece();
  requestAnimationFrame(updateGame);
}

drawNextPiece();
updateGame();

function simularKeyDown(tecla) {
  let key, code, which, keyCode;

  switch (tecla) {
    case 'Up':
      key = 'ArrowUp';
      code = 'ArrowUp';
      which = 38;
      keyCode = 38;
      break;
    case 'Down':
      key = 'ArrowDown';
      code = 'ArrowDown';
      which = 40;
      keyCode = 40;
      break;
    case 'Left':
      key = 'ArrowLeft';
      code = 'ArrowLeft';
      which = 37;
      keyCode = 37;
      break;
    case 'Right':
      key = 'ArrowRight';
      code = 'ArrowRight';
      which = 39;
      keyCode = 39;
      break;
    case 'Z':
      key = 'z';
      code = 'KeyZ';
      which = 90;
      keyCode = 90;
      break;
    case 'X':
      key = 'x';
      code = 'KeyX';
      which = 88;
      keyCode = 88;
      break;
  }

  const eventoKeyDown = new KeyboardEvent('keydown', {
    key: key,
    code: code,
    which: which,
    keyCode: keyCode,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(eventoKeyDown);
}

document.getElementById('upButton').addEventListener('click', () => simularKeyDown('Up'));
document.getElementById('downButton').addEventListener('click', () => simularKeyDown('Down'));
document.getElementById('leftButton').addEventListener('click', () => simularKeyDown('Left'));
document.getElementById('rightButton').addEventListener('click', () => simularKeyDown('Right'));
document.getElementById('rotarIzquierda').addEventListener('click', () => simularKeyDown('Z'));
document.getElementById('rotarDerecha').addEventListener('click', () => simularKeyDown('X'));