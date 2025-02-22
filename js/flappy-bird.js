const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let originalWidth = 320; // Ancho original del canvas
let originalHeight = 480; // Alto original del canvas

// Variables del juego
let birdX = 50;
let birdY = 150;
let birdVelocity = 0;
const gravity = 0.2; // Reducimos la gravedad
const jumpStrength = -5; // Ajustamos el salto para compensar
const birdRadius = 15;

let pipes = [];
const pipeWidth = 50;
const pipeGap = 200; // Aumentamos el espacio entre tubos para hacerlo más fácil
const pipeSpeed = 1.5; // Reducimos la velocidad de los tubos
let score = 0;
let gameOver = false;

// Cargar imagen de fondo (opcional)
const bgImage = new Image();
bgImage.src = 'img/flappy_bird_background.png'; 

// Cargar imagen del pájaro
const birdImage = new Image();
birdImage.src = "img/bird.png";

const pipeTopImage = new Image();
pipeTopImage.src = "img/pipe_top.png"; 

const pipeBottomImage = new Image();
pipeBottomImage.src = "img/pipe_bottom.png";

// Generar tubería cada cierto intervalo de tiempo
function generatePipe() {
  const minPipeHeight = 50 * (canvas.height / originalHeight); // Altura mínima de la tubería escalada
  const maxPipeHeight = canvas.height - pipeGap - minPipeHeight; // Altura máxima de la tubería escalada
  const pipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight)) + minPipeHeight;
  pipes.push({
      x: canvas.width,
      y: pipeHeight,
  });
}

// Función para iniciar el juego
function startGame() {
  birdY = 150;
  birdVelocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  generatePipe();
  animate();
}

// Detección de colisiones
function detectCollision(pipe) {
  // Colisión con el suelo y el techo
  if (birdY + birdRadius >= canvas.height || birdY - birdRadius <= 0) {
      return true;
  }

  // Colisión con las tuberías
  if (
      birdX + birdRadius >= pipe.x &&
      birdX - birdRadius <= pipe.x + pipeWidth &&
      (birdY - birdRadius <= pipe.y || birdY + birdRadius >= pipe.y + pipeGap)
  ) {
      return true;
  }

  return false;
}

// Función de salto del pájaro
function jump() {
  birdVelocity = jumpStrength;
}

// Animación principal
function animate() {
  if (gameOver) {
      document.getElementById("gameCanvas").style.display = "none"; 
      document.getElementById("game-over").classList.remove("hide"); // Mostrar el div
      document.getElementById("finalScore").textContent = score; // Mostrar la puntuación final
      return; // Detener la animación
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar fondo
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // Dibujar fondo
  // ctx.fillStyle = "#70c5ce";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(birdImage, birdX - birdRadius, birdY - birdRadius, birdRadius * 2, birdRadius * 2);

  // Dibujar pájaro
  // ctx.beginPath();
  // ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
  // ctx.fillStyle = "yellow";
  // ctx.fill();
  // ctx.closePath();

  // Actualizar la posición del pájaro
  birdVelocity += gravity;
  birdY += birdVelocity;

  // Dibujar tuberías y gestionar colisiones
  for (let i = pipes.length - 1; i >= 0; i--) {
    const pipe = pipes[i];
    pipe.x -= pipeSpeed;

    // Dibujar tubería superior
    ctx.drawImage(pipeTopImage, pipe.x, 0, pipeWidth, pipe.y);

    // Dibujar tubería inferior
    ctx.drawImage(pipeBottomImage, pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);

    // // Dibujar tubería superior
    // ctx.fillStyle = "green";
    // ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);

    // // Dibujar tubería inferior
    // ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);

    // Detectar colisión
    if (detectCollision(pipe)) {
      gameOver = true;
      document.getElementById("gameCanvas").style.display = "none"; 
      document.getElementById("game-over").classList.remove("hide"); // Mostrar el div
      document.getElementById("finalScore").textContent = score; // Mostrar la puntuación final
      return;
    }

    // Eliminar tuberías que ya no están en la pantalla
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(i, 1);
      score++;
    }
  }

  // Generar nuevas tuberías
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    generatePipe();
  }

  // Dibujar puntuación
  ctx.fillStyle = "white";
  ctx.font = "20px 'Press Start 2P', cursive";
  ctx.fillText(`Puntuación: ${score}`, 10, 30);

  requestAnimationFrame(animate);
}

// Evento de clic o toque para hacer que el pájaro salte
canvas.addEventListener("click", jump);
canvas.addEventListener("touchstart", jump);

function restartGame() {
  document.getElementById("game-over").classList.add("hide"); // Ocultar el div
  document.getElementById("gameCanvas").style.display = "block"; 
  startGame(); // Reiniciar el juego
}

function startGameBtn() {
  document.getElementById("start-game").style.display = "none"; // Ocultar el div
  document.getElementById("gameCanvas").style.display = "block"; 
  startGame(); // Reiniciar el juego
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Iniciar el juego
// startGame();