// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

// Game state
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop = null;
let isPaused = false;
let gameSpeed = 100;

// DOM elements
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

// Initialize
highScoreElement.textContent = highScore;

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
document.addEventListener('keydown', handleKeyPress);

function startGame() {
    // Reset game state
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    dx = 1;
    dy = 0;
    score = 0;
    isPaused = false;
    gameSpeed = 100;

    updateScore();
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    // Clear any existing game loop
    if (gameLoop) {
        clearInterval(gameLoop);
    }

    // Start new game loop
    gameLoop = setInterval(update, gameSpeed);
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Продолжить' : 'Пауза';
}

function handleKeyPress(event) {
    const key = event.key;

    // Prevent default arrow key behavior (scrolling)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.preventDefault();
    }

    // Change direction (prevent 180-degree turns)
    if (key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -1;
    } else if (key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 1;
    } else if (key === 'ArrowLeft' && dx === 0) {
        dx = -1;
        dy = 0;
    } else if (key === 'ArrowRight' && dx === 0) {
        dx = 1;
        dy = 0;
    }
}

function update() {
    if (isPaused) return;

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        gameOver();
        return;
    }

    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        food = generateFood();

        // Increase speed slightly
        if (score % 50 === 0 && gameSpeed > 50) {
            gameSpeed -= 5;
            clearInterval(gameLoop);
            gameLoop = setInterval(update, gameSpeed);
        }
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Snake head
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(
                segment.x * GRID_SIZE + 1,
                segment.y * GRID_SIZE + 1,
                GRID_SIZE - 2,
                GRID_SIZE - 2
            );

            // Eyes
            ctx.fillStyle = 'white';
            const eyeSize = 3;
            const eyeOffset = 5;

            if (dx === 1) { // Right
                ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset, segment.y * GRID_SIZE + 5, eyeSize, eyeSize);
                ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset, segment.y * GRID_SIZE + 12, eyeSize, eyeSize);
            } else if (dx === -1) { // Left
                ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + 5, eyeSize, eyeSize);
                ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + 12, eyeSize, eyeSize);
            } else if (dy === -1) { // Up
                ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + 2, eyeSize, eyeSize);
                ctx.fillRect(segment.x * GRID_SIZE + 12, segment.y * GRID_SIZE + 2, eyeSize, eyeSize);
            } else if (dy === 1) { // Down
                ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * GRID_SIZE + 12, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset, eyeSize, eyeSize);
            }
        } else {
            // Snake body
            const gradient = ctx.createLinearGradient(
                segment.x * GRID_SIZE,
                segment.y * GRID_SIZE,
                segment.x * GRID_SIZE + GRID_SIZE,
                segment.y * GRID_SIZE + GRID_SIZE
            );
            gradient.addColorStop(0, '#66BB6A');
            gradient.addColorStop(1, '#4CAF50');

            ctx.fillStyle = gradient;
            ctx.fillRect(
                segment.x * GRID_SIZE + 1,
                segment.y * GRID_SIZE + 1,
                GRID_SIZE - 2,
                GRID_SIZE - 2
            );
        }
    });

    // Draw food (apple)
    ctx.fillStyle = '#F44336';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Apple stem
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + 3);
    ctx.lineTo(food.x * GRID_SIZE + GRID_SIZE / 2 + 3, food.y * GRID_SIZE);
    ctx.stroke();
}

function generateFood() {
    let newFood;
    let isValidPosition = false;

    while (!isValidPosition) {
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };

        // Check if food spawns on snake
        isValidPosition = !snake.some(segment =>
            segment.x === newFood.x && segment.y === newFood.y
        );
    }

    return newFood;
}

function updateScore() {
    scoreElement.textContent = score;

    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

function gameOver() {
    clearInterval(gameLoop);
    gameLoop = null;

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Пауза';

    // Draw game over screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = '20px Arial';
    ctx.fillText(`Счёт: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    if (score === highScore && score > 0) {
        ctx.fillStyle = '#FFD700';
        ctx.fillText('Новый рекорд!', canvas.width / 2, canvas.height / 2 + 50);
    }
}

// Draw initial state
draw();
