const canvas = document.getElementById("breakout");
const startBtn = document.getElementById("start");
if (window.innerWidth < 480) {
  canvas.width = window.innerWidth;
} else {
  canvas.width = 480;
}
canvas.height = 320;
const ctx = canvas.getContext("2d");
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
const ballSpeed = 3.5;
let dx = ballSpeed;
let dy = -ballSpeed;

const paddleHeight = 10;
let paddleWidth = canvas.width / 6.4;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;

let rightPressed = false;
let leftPressed = false;

let brickRowCount;
let brickColumnCount;
const brickHeight = 15;
const brickPadding = 5;
const brickOffsetTop = 30;
const brickOffsetLeft = 15;
let brickWidth;
let score = 0;
let currentScore = 0;
let lives = 3;

// defining colours
let userColour;
let scoreAndLivesColour;
let ballColour;

let bricks;

const initGame = () => {
  localStorage.setItem("highScore", score.toString());
  brickRowCount = getRandomNumber(8, 5);
  brickColumnCount = getRandomNumber(5, 4);
  brickWidth =
    (canvas.width - brickOffsetLeft * 2 - (brickRowCount - 1) * brickPadding) /
    brickRowCount;
  userColour = getRandomColour();
  scoreAndLivesColour = getRandomColour();
  ballColour = getRandomColour();
  initBricks();
};

const changeDirectionX = () => {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
};

const initBricks = () => {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
};

const keyDownHandler = (e) => {
  if (e.code == "ArrowRight") {
    rightPressed = true;
  } else if (e.code == "ArrowLeft") {
    leftPressed = true;
  }
};

const keyUpHandler = (e) => {
  if (e.code == "ArrowRight") {
    rightPressed = false;
  } else if (e.code == "ArrowLeft") {
    leftPressed = false;
  }
};

const touchHandler = (e) => {
  e.preventDefault();
  if (e.touches) {
    const relativeX = e.touches[0].pageX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }
};

const getRandomColour = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const getRandomNumber = (max, min) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const collisionDetection = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (
        b.status == 1 &&
        x > b.x &&
        x < b.x + brickWidth &&
        y > b.y &&
        y < b.y + brickHeight
      ) {
        dy = -dy;
        b.status = 0;
        currentScore++;
        score += currentScore;
        if (currentScore == brickRowCount * brickColumnCount) {
          currentScore = 0;
          alert("YOU WIN, CONGRATS!");
          document.location.reload();
        }
      }
    }
  }
};

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColour;
  ctx.fill();
  ctx.closePath();
};

const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = userColour;
  ctx.fill();
  ctx.closePath();
};

const drawBricks = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = userColour;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

const drawScore = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = scoreAndLivesColour;
  ctx.fillText("Score: " + score, 8, 20);
};

const drawLives = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = scoreAndLivesColour;
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  changeDirectionX();
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x >= paddleX && x <= paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = ballSpeed;
        dy = -ballSpeed;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
};

const confirmStart = () => {
  if (confirm("Shall we start the game")) {
    draw();
  } else {
    alert("You have chosen to quit the game");
    document.location.reload();
  }
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchmove", touchHandler);

initGame();

startBtn.addEventListener("click", confirmStart);
