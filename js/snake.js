const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverText = document.getElementById("gameOverText");
const resetButton = document.getElementById("resetButton");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

const boxSize = 20;
let snake, direction, food, score, gameOver, foodSizeFactor, speed;

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
  gameOverText.style.display = "none";
  gameOverText.style.opacity = 0;
  resetButton.style.display = "none";
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
    eatSound.play();
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
  gameOverSound.play();
  gameOverText.style.display = "block";
  resetButton.style.display = "block";
  setTimeout(() => gameOverText.style.opacity = 1, 10); // Animación de "Game Over"
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
  init();
}

// Iniciar el juego por primera vez
init();