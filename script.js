const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const birdImg = new Image();
const pipeImg = new Image();
const backgroundImg = new Image();

birdImg.src = "https://i.postimg.cc/vcVvXnHr/IPIS.png"; // Bird image URL
pipeImg.src = "https://i.postimg.cc/8s3Hh4Dk/bong.png"; // Pipe image URL
backgroundImg.src = "https://i.postimg.cc/zHqcyL2h/Back-Ground.jpg"; // Updated Background image URL

let bird = {
    x: 50,
    y: 150,
    width: 34, // Adjusted width for visibility
    height: 24, // Adjusted height for visibility
    gravity: 0.5,
    lift: -8,
    velocity: 0,
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function createPipe() {
    const pipeHeight = Math.random() * (canvas.height / 2) + 50;
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: canvas.height - pipeHeight - 150,
    });
}

function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, 0, 50, pipe.top); // Top pipe
        ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, 50, pipe.bottom); // Bottom pipe
    });
}

function updatePipes() {
    if (frame % 75 === 0) {
        createPipe();
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    // Increment score for each pipe passed
    pipes.forEach(pipe => {
        if (pipe.x + 50 < bird.x && !pipe.passed) {
            score++;
            pipe.passed = true; // Mark this pipe as passed
        }
    });

    // Remove pipes that have gone off-screen
    if (pipes.length > 0 && pipes[0].x < -50) {
        pipes.shift();
    }
}

function collisionDetection() {
    pipes.forEach(pipe => {
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + 50 &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            gameOver = true;
        }
    });

    if (bird.y + bird.height >= canvas.height || bird.y < 0) {
        gameOver = true;
    }
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;

    // Hide the Game Over message
    document.getElementById("gameOverMessage").style.display = "none";
}

function displayGameOver() {
    document.getElementById("finalScore").innerText = `Final Score: ${score}`;
    document.getElementById("gameOverMessage").style.display = "block";
}

function drawIntro() {
    ctx.fillStyle = "yellow";
    ctx.font = "36px Arial";
    ctx.fillText("Flying Cockroach Let's Go", 50, canvas.height / 2);
}

function gameLoop() {
    drawBackground(); // Draw background

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        drawBird();
        drawPipes();
        updatePipes();
        collisionDetection();
        drawScore();
    } else {
        displayGameOver();
    }

    frame++;
    requestAnimationFrame(gameLoop);
}

// Start the game when any key is pressed
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !gameOver) {
        bird.velocity = bird.lift;
    } else if (gameOver) {
        resetGame();
        drawIntro(); // Show intro message before restarting the game
        setTimeout(() => {
            gameLoop();
        }, 2000); // Start game after 2 seconds
    }
});

// Start the game loop
birdImg.onload = function () {
    pipeImg.onload = function () {
        backgroundImg.onload = function () {
            drawIntro(); // Show intro message before starting the game
            setTimeout(() => {
                gameLoop();
            }, 2000); // Start game after 2 seconds
        };
    };
};
