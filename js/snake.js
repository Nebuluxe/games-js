const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

const gameOverDiv = document.getElementById("game-over");
const gameDiv = document.getElementById("game");
const startGameDiv = document.getElementById("start-game");

const boxSize = 20;
let snake, direction, food, score, gameOver, foodSizeFactor, speed;

document.getElementById("upButton").addEventListener("click", () => {
  if (direction !== "DOWN") direction = "UP";
});

document.getElementById("downButton").addEventListener("click", () => {
  if (direction !== "UP") direction = "DOWN";
});

document.getElementById("leftButton").addEventListener("click", () => {
  if (direction !== "RIGHT") direction = "LEFT";
});

document.getElementById("rightButton").addEventListener("click", () => {
  if (direction !== "LEFT") direction = "RIGHT";
});

// Inicializar el juego
function init() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  food = getRandomFoodPosition();
  score = 0;
  gameOver = false;
  foodSizeFactor = 1.0;
  speed = 100;
  scoreDisplay.textContent = score;
  gameOverDiv.classList.add("hide");
  
  const highScore = parseInt(localStorage.getItem("highScoreSnake")) || 0;

  highScoreDisplay.textContent = highScore;

  gameLoop();
}

// Obtener una posición aleatoria para la comida
function getRandomFoodPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
  };
}

// Dibujar la serpiente con sombra
function drawSnake() {
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 5;
  ctx.fillStyle = "#32a852";
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
  });
  ctx.shadowBlur = 0; // Eliminar sombra
}

// Dibujar la comida con animación y sombra
function drawFood() {
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 5;
  ctx.fillStyle = "tomato";
  const sizeOffset = (boxSize * foodSizeFactor - boxSize) / 2;
  ctx.fillRect(food.x - sizeOffset, food.y - sizeOffset, boxSize * foodSizeFactor, boxSize * foodSizeFactor);
  ctx.shadowBlur = 0; // Eliminar sombra
}

// Mover la serpiente y actualizar la puntuación
function moveSnake() {
  const head = { ...snake[0] };

  if (direction === "RIGHT") head.x += boxSize;
  if (direction === "LEFT") head.x -= boxSize;
  if (direction === "UP") head.y -= boxSize;
  if (direction === "DOWN") head.y += boxSize;

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    endGame();
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    food = getRandomFoodPosition();
    speed = Math.max(50, speed - 5); // Aumentar dificultad
  } else {
    snake.pop();
  }
}

// Cambiar la dirección con las teclas
document.addEventListener("keydown", event => {
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Función para terminar el juego
function endGame() {
  gameOver = true;
  gameOverDiv.classList.remove("hide");
  gameDiv.classList.add("hide");

  const currentHighScore = parseInt(localStorage.getItem("highScoreSnake")) || 0;

  // Verificar si la puntuación actual es mayor que la puntuación más alta
  if (score > currentHighScore) {
      // Almacenar la nueva puntuación más alta
      localStorage.setItem("highScoreSnake", score.toString());
  }
}

// Animación de la comida (efecto de "latido")
function animateFood() {
  foodSizeFactor = 1 + 0.1 * Math.sin(Date.now() / 150);
}

// Función principal de dibujo
function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animateFood();
  drawFood();
  drawSnake();
  moveSnake();

  setTimeout(gameLoop, speed);
}

// Reiniciar el juego
function resetGame() {
  gameDiv.classList.remove("hide");

  init();
}

function startGame() {
  startGameDiv.classList.add("hide");
  gameDiv.classList.remove("hide");
  init();
}