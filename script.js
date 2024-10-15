const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const birdImage = new Image();
birdImage.src = 'https://i.postimg.cc/kBX1rqYJ/BIRD-2.png'; // Image for bird

const pipeTopImage = new Image();
pipeTopImage.src = 'https://i.postimg.cc/JymHg4KK/PIPE-ABOVE.png'; // New cropped pipe above URL

const pipeBottomImage = new Image();
pipeBottomImage.src = 'https://i.postimg.cc/f3KShnrs/PIPE-BELOW.png'; // New cropped pipe below URL

// Load confetti images
const confettiImages = [];
const confettiUrls = [
    'https://i.postimg.cc/2qhRqCDp/Confetti1.png',
    'https://i.postimg.cc/ygKqc21D/Confetti2.png',
    'https://i.postimg.cc/dkjbBn34/Confetti3.png',
    'https://i.postimg.cc/yWV4dqp5/Confetti4.png',
    'https://i.postimg.cc/N2GWPTrY/Confetti5.png',
    'https://i.postimg.cc/grN9LMf0/Confetti6.png',
    'https://i.postimg.cc/QHt2QQ3J/Confetti7.png',
];

confettiUrls.forEach(url => {
    const img = new Image();
    img.src = url;
    confettiImages.push(img);
});

let bird = {
    x: 50,
    y: 150,
    width: 24,
    height: 34,
    gravity: 0.5,
    lift: -8,
    velocity: 0,
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let showConfetti = false;

function createPipe() {
    const pipeHeight = Math.random() * (canvas.height / 2) + 50;
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: canvas.height - pipeHeight - 150,
    });
}

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeTopImage, pipe.x, 0, 50, pipe.top); // Draw the top pipe
        ctx.drawImage(pipeBottomImage, pipe.x, canvas.height - pipe.bottom, 50, pipe.bottom); // Draw the bottom pipe
    });
}

function updatePipes() {
    if (frame % 75 === 0) {
        createPipe();
    }
    pipes.forEach(pipe => {
        pipe.x -= 2;
    });
    if (pipes.length > 0 && pipes[0].x < -50) {
        pipes.shift();
        score++;
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
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 90, 30); // Score position updated
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
    showConfetti = true; // Show confetti on reset
}

function drawConfetti() {
    confettiImages.forEach((confetti, index) => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.drawImage(confetti, x, y, 30, 30); // Draw confetti images at random positions
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (showConfetti) {
        drawConfetti();
        setTimeout(() => {
            showConfetti = false; // Hide confetti after a short duration
        }, 2000); // Show confetti for 2 seconds
    }

    if (!gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        drawBird();
        drawPipes();
        updatePipes();
        collisionDetection();
        drawScore();
    } else {
        ctx.fillStyle = "red";
        ctx.font = "48px Arial";
        ctx.fillText("Game Over", 70, canvas.height / 2);
        ctx.fillText(`Score: ${score}`, 70, canvas.height / 2 + 50); // Show score after game over
        ctx.fillText("Tap to Restart", 70, canvas.height / 2 + 100);
    }
    frame++;
    requestAnimationFrame(gameLoop);
}

// Touch controls for mobile
canvas.addEventListener("click", () => {
    if (!gameOver) {
        bird.velocity = bird.lift;
    } else {
        resetGame();
    }
});

// Start the game loop
gameLoop();
