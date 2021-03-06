

// Select the canvas
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Create user and com paddle objects
const user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    velocityY: 0,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

const com = {
    x: canvas.width - 10,
    y: canvas.height/2 - 100/2,
    velocityY: 0,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

// Create ball object
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
}

// Create the net object
const net = {
    x: canvas.width/2-1,
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE"
}

// Draw net function
function drawNet(){
    for(let i = 0; i <= canvas.height; i += 15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Draw rectangle function
function drawRect(x, y, w, h, color){
    context.fillStyle = color;
    context.fillRect(x, y, w, h)
}


// Draw circle function
function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

// Text functions
function drawText(text, x, y, color){
    context.fillStyle = color;
    context.font = "45px fantasy"
    context.fillText(text, x, y);
}

// Render graphics function
function render(){
    // Clear the canvas
    drawRect(0,0, canvas.width, canvas.height, "BLACK");

    // Draw the net
    drawNet();

    // Draw the scores
    drawText(user.score, canvas.width/4, canvas.height/5, "WHITE");
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "WHITE");

    // Draw paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Draw the ball

    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Control the users paddle with mouse movement
canvas.addEventListener("mousemove", movePaddle);
function movePaddle(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}

// Pause functionality
window.addEventListener("keydown", pause);
function pause(event){
    if(event.keyCode == 27 || event.keyCode == 80)
        alert("The game is paused. Select 'OK' to continue!");
}

window.addEventListener("keydown", restart);
function restart(event){
    if(event.keyCode == 82){
        scored(user);
        user.score = 0;
        com.score = 0;
    }
        
}


// window.addEventListener("keydown", p);
// function p(event){
//         alert(event.keyCode);
// }

// Player 1 WASD movement functionality
window.addEventListener("keydown", userPaddleDown);
function userPaddleDown(event){
    if(event.keyCode == 38)
        user.velocityY = -10;     
    if(event.keyCode == 40)
        user.velocityY = 10;
    
// if(event.keyCode == 38)
//     com.velocityY = -10;
// if(event.keyCode == 40)
//     com.velocityY = 10;
}

window.addEventListener("keyup", userPaddleUp);
function userPaddleUp(event){
    if(event.keyCode == 38 || event.keyCode == 40)
        user.velocityY = 0;

    // if(event.keyCode == 38 || event.keyCode == 40)
    //     com.velocityY = 0;
}




// Collision detection
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.right = b.x + b.radius;
    b.left = b.x - b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && 
    b.top < p.bottom;
}

// Reset ball function called in update when a player scores
function resetBallPos(){
    ball.speed = 5;
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
}

// Scoring function which updates UI and resets ball
function scored (player){
    player.score++;
    resetBallPos();
    ball.velocityX = (player == user) ? 5 : -5;
    ball.velocityY = 5;
}

function boundCanvas(){
    if(user.y < -50){
        user.y = -50;
    } else if (user.y + user.height > canvas.height + 50) {
        user.y = canvas.height - user.height + 50;
    }

    if(com.y < -50){
        com.y = -50;
    } else if (com.y + com.height > canvas.height + 50) {
        com.y = canvas.height - com.height - 50;
    }
}


// Update function: position, movement, score, ....
function update(){
    boundCanvas();

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //AI controlling com paddle
    let comLevel = 0.12;
    com.y += (ball.y - (com.y + com.height/2)) * comLevel;

    // Player 1 paddle movement
    user.y += user.velocityY;

    // Player 2 paddle movement
    // com.y += com.velocityY;

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width/2) ? user : com;
    if(collision(ball, player)){
        // See where the ball hits the paddle
        let collidePoint = ball.y - (player.y + player.height/2);

        collidePoint = collidePoint/(player.height/2);

        // Calculate the collision angle
        let angleRad = collidePoint * (Math.PI/4);

        let direction = (ball.x < canvas.width/2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);


        ball.speed += 0.7;
    }

    if(ball.x + ball.radius < 0){
        scored(com);
    } else if (ball.x - ball.radius > canvas.width) {
        scored(user)
    }
      

}


// Game init
function game(){
    update();
    render();
}

// Game loop
const fps = 60;
setInterval(game, 1000/fps);