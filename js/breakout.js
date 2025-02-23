const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let ballRadius, paddleHeight, paddleWidth, brickRowCount, brickColumnCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft;
let x, y, dx, dy, paddleX, rightPressed, leftPressed, score, lives, bricks, isMobile;
let brickWidthGlobal, brickHeightGlobal, brickPaddingGlobal, brickOffsetTopGlobal, brickOffsetLeftGlobal, brickRowCountGlobal, brickColumnCountGlobal;

function initGame() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 800;

  if (isMobile) {
    ballRadius = 7;
    paddleHeight = 15;
    paddleWidth = 60;
    dx = 3;
    dy = -3;
  } else {
    ballRadius = 10;
    paddleHeight = 10;
    paddleWidth = 75;
    dx = 2;
    dy = -2;
  }

  x = canvas.width / 2;
  y = canvas.height - 30;
  paddleX = (canvas.width - paddleWidth) / 2;
  rightPressed = false;
  leftPressed = false;
  score = 0;
  lives = 3;
  initBricks();
  addEventListeners();
  draw();
}

function initBricks() {
  bricks = [];

  const brickWidth = canvas.width / 10;
  const brickHeight = canvas.height / 20;
  const brickPadding = brickWidth / 20;
  const brickOffsetTop = brickHeight;
  const brickOffsetLeft = brickWidth / 2;

  const brickColumnCount = Math.floor((canvas.width - brickOffsetLeft * 2) / (brickWidth + brickPadding));
  const brickRowCount = Math.floor((canvas.height / 2 - brickOffsetTop) / (brickHeight + brickPadding));

  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  brickWidthGlobal = brickWidth;
  brickHeightGlobal = brickHeight;
  brickPaddingGlobal = brickPadding;
  brickOffsetTopGlobal = brickOffsetTop;
  brickOffsetLeftGlobal = brickOffsetLeft;
  brickRowCountGlobal = brickRowCount;
  brickColumnCountGlobal = brickColumnCount;
}

function addEventListeners() {
  if (isMobile) {
    document.addEventListener("touchstart", touchStartHandler);
    document.addEventListener("touchmove", touchMoveHandler);
  } else {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("mousemove", mouseMoveHandler);
  }
}

function keyDownHandler(e) {
  if (e.code === "ArrowRight") {
    rightPressed = true;
  } else if (e.code === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.code === "ArrowRight") {
    rightPressed = false;
  } else if (e.code === "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function touchStartHandler(e) {
  const touchX = e.touches[0].clientX - canvas.offsetLeft;
  if (touchX > paddleX && touchX < paddleX + paddleWidth) {
    rightPressed = true;
  } else {
    leftPressed = true;
  }
}

function touchMoveHandler(e) {
  const touchX = e.touches[0].clientX - canvas.offsetLeft;
  paddleX = touchX - paddleWidth / 2;
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCountGlobal; c++) {
    for (let r = 0; r < brickRowCountGlobal; r++) {
      const b = bricks[c][r];
      if (b.status === 1 && x > b.x && x < b.x + brickWidthGlobal && y > b.y && y < b.y + brickHeightGlobal) {
        dy = -dy;
        b.status = 0;
        score++;
        if (score === brickRowCountGlobal * brickColumnCountGlobal) {
          alert("YOU WIN, CONGRATS!");
          document.location.reload();
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCountGlobal; c++) {
    for (let r = 0; r < brickRowCountGlobal; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidthGlobal + brickPaddingGlobal) + brickOffsetLeftGlobal;
        const brickY = r * (brickHeightGlobal + brickPaddingGlobal) + brickOffsetTopGlobal;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidthGlobal, brickHeightGlobal);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "10px 'Press Start 2P', cursive";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "10px 'Press Start 2P', cursive";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 85, 20);
}

function updateGame() {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = isMobile ? 3 : 2;
        dy = isMobile ? -3 : -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  x += dx;
  y += dy;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  updateGame();
  requestAnimationFrame(draw);
}

initGame();