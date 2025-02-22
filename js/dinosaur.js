const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

// Variables del dinosaurio
const dino = {
  x: 50,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  dy: 0,
  gravity: 0.5,
  jumpPower: -10,
  isJumping: false,
  color: "#4CAF50" // Color verde del dino
};

// Variables del cactus (obstáculo)
const cactus = {
  x: canvas.width,
  y: canvas.height - 60,
  width: 20,
  height: 40,
  speed: 5,
  color: "#8B4513" // Color marrón del cactus
};

// Variables del juego
let score = 0;
let gameOver = false;

// Función para dibujar el dinosaurio
function drawDino() {
  ctx.fillStyle = dino.color;
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
  ctx.strokeStyle = "#2E7D32"; // Borde oscuro para el dino
  ctx.lineWidth = 2;
  ctx.strokeRect(dino.x, dino.y, dino.width, dino.height);
}

// Función para dibujar el cactus
function drawCactus() {
  ctx.fillStyle = cactus.color;
  ctx.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);
  ctx.strokeStyle = "#5D4037"; // Borde oscuro para el cactus
  ctx.lineWidth = 2;
  ctx.strokeRect(cactus.x, cactus.y, cactus.width, cactus.height);
}

// Función para actualizar la posición del dinosaurio
function updateDino() {
  if (dino.isJumping) {
    dino.dy += dino.gravity;
    dino.y += dino.dy;
    if (dino.y > canvas.height - dino.height - 20) { // Ajuste de altura
      dino.y = canvas.height - dino.height - 20;
      dino.dy = 0;
      dino.isJumping = false;
    }
  }
}

// Función para actualizar la posición del cactus
function updateCactus() {
  cactus.x -= cactus.speed;
  if (cactus.x + cactus.width < 0) {
    cactus.x = canvas.width;
    score++;  // Incrementar la puntuación cuando el cactus pasa
    cactus.speed += 0.1;  // Aumentar velocidad del cactus
    scoreDisplay.textContent = score;  // Actualizar la puntuación en pantalla
  }
}

// Función para detectar colisiones
function detectCollision() {
  if (
    dino.x < cactus.x + cactus.width &&
    dino.x + dino.width > cactus.x &&
    dino.y < cactus.y + cactus.height &&
    dino.y + dino.height > cactus.y
  ) {
    gameOver = true;
  }
}

// Función para reiniciar el juego
function resetGame() {
  cactus.x = canvas.width;
  score = 0;
  gameOver = false;
  cactus.speed = 5;
  dino.y = canvas.height - dino.height - 20;
  scoreDisplay.textContent = score;
  document.body.style.backgroundColor = "#f7f7f7";  // Resetear fondo
}

// Función principal de dibujo
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 30, canvas.height / 2 + 30);
    ctx.fillText("Press R to Restart", canvas.width / 2 - 70, canvas.height / 2 + 60);
    document.body.style.backgroundColor = "#ffe6e6";  // Fondo rojo suave al perder
    return;
  }

  drawDino();
  drawCactus();
  updateDino();
  updateCactus();
  detectCollision();

  requestAnimationFrame(gameLoop);
}

// Manejar el salto del dinosaurio
document.addEventListener("keydown", event => {
  if (event.key === " " && !dino.isJumping) {
    dino.isJumping = true;
    dino.dy = dino.jumpPower;
  } else if (event.key === "r" || event.key === "R") {
    if (gameOver) resetGame();
    gameLoop();
  }
}); 

// Iniciar el juego
gameLoop();