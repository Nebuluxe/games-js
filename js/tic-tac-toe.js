const board = document.getElementById('board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(event) {
  const cell = event.target;
  const index = cell.dataset.index;

  if (gameBoard[index] === '' && gameActive) {
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    if (checkWin()) {
      message.textContent = `¡Jugador ${currentPlayer} gana!`;
      gameActive = false;
    } else if (isBoardFull()) {
      message.textContent = '¡Empate!';
      gameActive = false;
    } else {
      togglePlayer();
    }
  }
}

function togglePlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
  });
}

function isBoardFull() {
  return gameBoard.every(cell => cell !== '');
}

function resetGame() {
  currentPlayer = 'X';
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  message.textContent = '';
  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = '';
  });
}

createBoard();
resetButton.addEventListener('click', resetGame);