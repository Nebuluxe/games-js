const boardSize = 10; // Tamaño del tablero (10x10)
const mineCount = 15; // Número de minas
let board = [];
let gameOver = false;
let mineCounter = mineCount;
let timer = 0;
let timerInterval;

// Inicializar el tablero y el juego
function initializeGame() {
  board = Array(boardSize).fill().map(() => Array(boardSize).fill({}));
  gameOver = false;
  mineCounter = mineCount;
  timer = 0;
  clearInterval(timerInterval);
  document.getElementById("timer").textContent = "000";
  document.getElementById("mine-counter").textContent = mineCounter.toString().padStart(3, "0");
  document.getElementById("smiley").textContent = "😊";
  timerInterval = setInterval(updateTimer, 1000);
  createBoard();
  renderBoard();
}

// Crear el tablero de juego
function createBoard() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      board[row][col] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighboringMines: 0,
      };
    }
  }
  placeMines();
  calculateNeighboringMines();
}

// Colocar minas aleatoriamente
function placeMines() {
  let placedMines = 0;
  while (placedMines < mineCount) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      placedMines++;
    }
  }
}

// Calcular el número de minas adyacentes
function calculateNeighboringMines() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (!board[row][col].isMine) {
        board[row][col].neighboringMines = countMines(row, col);
      }
    }
  }
}

// Contar las minas alrededor de una celda
function countMines(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        if (board[newRow][newCol].isMine) count++;
      }
    }
  }
  return count;
}

// Renderizar el tablero
function renderBoard() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 32px)`;

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.dataset.row = row;
      cellElement.dataset.col = col;
      cellElement.addEventListener("click", handleLeftClick);
      cellElement.addEventListener("contextmenu", handleRightClick);
      boardElement.appendChild(cellElement);
    }
  }
}

// Manejador de clic izquierdo
function handleLeftClick(event) {
  if (gameOver) return;

  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  const cell = board[row][col];

  if (cell.isFlagged || cell.isRevealed) return;

  cell.isRevealed = true;

  if (cell.isMine) {
    event.target.classList.add("mine");
    gameOver = true;
    clearInterval(timerInterval);
    revealAllMines();
    document.getElementById("smiley").textContent = "😵";
    alert("¡Game Over! Has perdido.");
  } else {
    event.target.classList.add("revealed");
    if (cell.neighboringMines > 0) {
      event.target.textContent = cell.neighboringMines;
      event.target.setAttribute("data-mines", cell.neighboringMines);
    } else {
      revealEmptyCells(row, col);
    }
  }

  checkWinCondition();
}

// Manejador de clic derecho (colocar o quitar bandera)
function handleRightClick(event) {
  event.preventDefault();
  if (gameOver) return;

  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  const cell = board[row][col];

  if (cell.isRevealed) return;

  cell.isFlagged = !cell.isFlagged;
  event.target.classList.toggle("flag");

  mineCounter += cell.isFlagged ? -1 : 1;
  document.getElementById("mine-counter").textContent = mineCounter.toString().padStart(3, "0");
}

// Revelar todas las minas cuando se pierde el juego
function revealAllMines() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = board[row][col];
      if (cell.isMine) {
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cellElement.classList.add("mine");
      }
    }
  }
}

// Revelar celdas vacías adyacentes recursivamente
function revealEmptyCells(row, col) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        const adjacentCell = board[newRow][newCol];
        const cellElement = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
        if (!adjacentCell.isRevealed && !adjacentCell.isMine) {
          adjacentCell.isRevealed = true;
          cellElement.classList.add("revealed");
          if (adjacentCell.neighboringMines > 0) {
            cellElement.textContent = adjacentCell.neighboringMines;
            cellElement.setAttribute("data-mines", adjacentCell.neighboringMines);
          } else {
            revealEmptyCells(newRow, newCol);
          }
        }
      }
    }
  }
}

// Verificar si el jugador ha ganado el juego
function checkWinCondition() {
  let revealedCount = 0;
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board[row][col].isRevealed) {
        revealedCount++;
      }
    }
  }

  if (revealedCount === boardSize * boardSize - mineCount) {
    alert("¡Felicidades! Has ganado.");
    document.getElementById("smiley").textContent = "😎";
    gameOver = true;
    clearInterval(timerInterval);
  }
}

// Actualizar el temporizador
function updateTimer() {
  timer++;
  document.getElementById("timer").textContent = timer.toString().padStart(3, "0");
}

// Función para reiniciar el juego
document.getElementById("smiley").addEventListener("click", initializeGame);

// Inicializar el juego
initializeGame();