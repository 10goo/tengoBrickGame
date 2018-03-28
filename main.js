// Assign canvas reference to variable
canvas = document.getElementById('snake-canvas');
// Specify context (2D in this case)
var ctx = canvas.getContext("2d");
var 
    score = 0,
    pointsPerBrick = 10;
// Ball variables
var
    ballX = canvas.width/2,
    ballY = canvas.height-30,
    //Starting vector (random);
    dx = Math.floor(Math.random()*6) - 2.5,
    dy = Math.floor(Math.random()*2) - 2.5, // Can only be negative to start upwards
    ballRadius = 5;
// Paddle variables
var
    paddleWidth = 75,
    paddleHeight = 5,
    paddleX = (canvas.width-paddleWidth)/2,
    rightPressed = false,
    leftPressed = false;
// Brick variables
var
    brickRows = 3,
    brickColumns = 5,
    brickWidth = 45,
    brickHeight = 10,
    brickPadding = 5,
    brickOffsetTop = 30,
    brickOffsetLeft = 30;

var bricks = [];
// Populate array
for(i=0; i < brickColumns; i++) {
    bricks[i] = [];
    for(j = 0; j < brickRows; j++) {
        bricks[i][j] = { x: 0, y: 0, state: 1 };
    }
}

let drawScore = () => {
    ctx.font = '16px Verdana';
    ctx.fillStyle = '#000000';
    ctx.fillText('Score: ' + score, 8, 20);// 8 and 20 are the coordinates where text is placed
}

let drawBricks = () => {
    // Draw columns
    for (let i=0; i < brickColumns; i++) {
        // Draw lines
        for (let j = 0; j < brickRows; j++) {
            if (bricks[i][j].state === 1){
                let brickX = (brickOffsetLeft + i*(brickPadding + brickWidth));
                let brickY = (brickOffsetTop + j*(brickPadding + brickHeight));
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = 'rgb(178, 34, 34)';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

let detectCollision = () => {
    for(i=0; i < brickColumns; i++) {
        for(j = 0; j < brickRows; j++) {
            let b = bricks[i][j];
            // Only detect collision when brick is active
            if (b.state === 1){
                if ( ballX > b.x 
                    && ballX < b.x + brickWidth 
                    && ballY > b.y
                    && ballY < b.y + brickHeight){
                    // Bounce ball back from brick
                    dy = -dy;
                    // Clear brick
                    b.state = 0;
                    score += pointsPerBrick;
                    // Display winning message when each brick is destroyed
                    if (score === pointsPerBrick * brickRows * brickColumns){
                        alert('YOU WIN! SCORE: ' + score);
                        document.location.reload();
                    }
                } 
            }
        }
    }
}

let drawBall = () => {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#777';
    ctx.fill();
    ctx.closePath();
}

let drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#777';
    ctx.fill();
    ctx.closePath();
    // Paddle movement
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 5;
    }
    if (leftPressed && paddleX > 0) {
        paddleX -= 5;
    }
}

let drawBackground = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let draw = () => {
    // Clear canvas on each frame;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawScore();
    drawBricks();
    drawBall();
    drawPaddle();
    detectCollision();
    // Boucne ball back from the wall
    // Left and right walls
    if ( ballX + dx + ballRadius > canvas.width || ballX + dx - ballRadius < 0){
        dx = -dx;// Reverse direction
    }
    // Top wall and paddle
    if ( ballY + dy - ballRadius < 0){
        dy = -dy; 
    } else if (ballY + dy + ballRadius > canvas.height ){
        // Bounce off paddle
        if ( paddleX < ballX && ballX < paddleX + paddleWidth){
            dy = -dy;
        } else {
            // Game ends
            alert('Game over!!!');
            document.location.reload();
        }
    }
    // Move ball
    ballX += dx;
    ballY += dy;
    // Animate
    requestAnimationFrame(draw); // Smoother animation than setInterval
}

// setInterval(draw, 10); //replaced with requestAnimationFrame on bottom of file
draw();

let keyDownHandler = (event) => {
    if(event.keyCode == 39) {
        rightPressed = true;
    }
    else if(event.keyCode == 37) {
        leftPressed = true;
    }
}

let keyUpHandler = (event) => {
    if(event.keyCode == 39) {
        rightPressed = false;
    }
    else if(event.keyCode == 37) {
        leftPressed = false;
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

