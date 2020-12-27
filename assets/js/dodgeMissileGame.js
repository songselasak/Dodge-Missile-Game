var canvas = document.getElementById("dodgeMissileCanvas");
var context = canvas.getContext('2d');

// ---------- Global function ----------
// Function to create square object
function makeSquare(x, y, length, speed, direction) {
    return {
        x: x,
        y: y,
        l: length,
        s: speed,
        d: direction,
        draw: function() {
            context.fillRect(this.x, this.y, this.l, this.l);
        }
    };
}

// Function to create enemy
var enemies = [];
var enemyLocation = [makeEnemyRight, makeEnemyLeft, makeEnemyTop, makeEnemyBottom];
var enemyBaseSpeed = 1.5;

function randomNumber(n) { 
	return Math.floor( Math.random() * n ); 
} 

function makeEnemyRight(){
    var enemySize = 15;
    var enemySpeed = Math.round(Math.random() * enemyBaseSpeed) + enemyBaseSpeed;
    var direction = "right";
    var enemyX = canvas.clientWidth;
    var enemyY = Math.round(Math.random() *(canvas.height - enemySize * 2)) + enemySize;
    enemies.push(makeSquare(enemyX, enemyY, enemySize, enemySpeed, direction));
    console.log("Right");
    
}

function makeEnemyLeft(){
    var enemySize = 15;
    var enemySpeed = Math.round(Math.random() * enemyBaseSpeed) + enemyBaseSpeed;
    var direction = "left";
    var enemyX = -enemySize;
    var enemyY = Math.round(Math.random() *(canvas.height - enemySize * 2)) + enemySize;
    enemies.push(makeSquare(enemyX, enemyY, enemySize, enemySpeed, direction));
    console.log("Left");
    
}

function makeEnemyTop(){
    var enemySize = 15;
    var enemySpeed = Math.round(Math.random() * enemyBaseSpeed) + enemyBaseSpeed;
    direction = "top";
    var enemyX = Math.round(Math.random() *(canvas.width - enemySize * 2)) + enemySize;
    var enemyY = -15;
    enemies.push(makeSquare(enemyX, enemyY, enemySize, enemySpeed, direction));
    console.log("Top");
    
}

function makeEnemyBottom(){
    var enemySize = 15;
    var enemySpeed = Math.round(Math.random() * enemyBaseSpeed) + enemyBaseSpeed;
    direction = "bottom";
    var enemyX = Math.round(Math.random() *(canvas.width - enemySize * 2)) + enemySize;
    var enemyY = canvas.clientHeight;
    enemies.push(makeSquare(enemyX, enemyY, enemySize, enemySpeed, direction));
    console.log("Bottom");
    
}

function makeEnemy(){
    enemyLocation[randomNumber(enemyLocation.length)]();
}

// Function to calculate the score
function addscore(){
    score++;
}

// Function to clear screen
function erase(){
    context.fillStyle = '#FFFFFF';
    context.fillRect(0,0,800,500);
}

//Function to check collsion
function isWithin(a,b,c) {
    return (a>b && a<c);
  }
function isColliding(a,b) {
var result = false;
if (isWithin(b.x, a.x, a.x+a.l) || isWithin(b.x+b.l, a.x, a.x+a.l)) {
    if(isWithin(b.y,a.y, a.y+a.l) || isWithin(b.y+b.l, a.y, a.y+a.l)) {
        result = true;
        console.log("hit");
    }
}
return result;
}

// ---------- Global Variables ----------
// Flags to track keyboard control
var up = false;
var down = false;
var left = false;
var right = false;
var timeBetweenEnemies = 2000;

// ----------- Initiate object of the game ----------
// Create Ship object that we are controlling
var ship = makeSquare((canvas.width/2)-15, (canvas.height/2)-15,30,3);
var score = 0;

// ---------- Event Listener ----------
// Add keyboard listener
canvas.addEventListener('keydown', function(event){
    event.preventDefault();
    if (event.key == "ArrowUp") {
        up = true;
    }
    if(event.key == "ArrowDown") {
        down = true;
    }
    if(event.key == "ArrowLeft") {
        left = true;
    }
    if(event.key == "ArrowRight") {
        right = true;
    }
});

canvas.addEventListener('keyup', function(event){
    event.preventDefault();
    if (event.key == "ArrowUp") {
        up = false;
    }
    if(event.key == "ArrowDown") {
        down = false;
    }
    if(event.key == "ArrowLeft") {
        left = false;
    }
    if(event.key == "ArrowRight") {
        right = false;
    }
});

// Main function of the game
function draw(){
    erase();
    var gameOver = false;

    //Draw enemy
    enemies.forEach(function(enemy) {
        if (enemy.d == "right"){
            enemy.x -= enemy.s;
        }
        if (enemy.d == "left"){
            enemy.x += enemy.s;
        }
        if (enemy.d == "top"){
            enemy.y += enemy.s;
        }
        if (enemy.d == "bottom"){
            enemy.y -= enemy.s;
        }
        
        context.fillStyle = '#E74C2A';
        enemy.draw();
    })

    //Move our ship
    if(down) {
        ship.y += ship.s;
    }
    if(up) {
        ship.y -= ship.s;
    }
    if(left) {
        ship.x -= ship.s;
    }
    if(right) {
        ship.x += ship.s;
    }
    // Prevent ship go out of canvas
    if (ship.y <0){
        ship.y = 0;
    }
    if (ship.y > canvas.height - ship.l) {
        ship.y = canvas.height - ship.l;
    }
    if (ship.x <0){
        ship.x = 0;
    }
    if (ship.x > canvas.width - ship.l) {
        ship.x = canvas.width - ship.l;
    }

    // Draw the ship on screen
    context.fillStyle = "#6F7AB8";
    ship.draw();

    //Check collision with enemies
    enemies.forEach(function(enemy, i) {
        if(isColliding(ship, enemy)) {
            gameOver = true;
            console.log(score);
        }
    })

    if (gameOver) {
        context.fillStyle = '#FFFFFF';
        context.fillRect(0,0,800,500);
        context.fillStyle = '#000000';
        context.font = "15px Arial";
        context.fillText("You survive "+score+" second!", (canvas.width/2)-75, canvas.height/2);
    }
    else {
        window.requestAnimationFrame(draw);
    }
}

setInterval(makeEnemy, timeBetweenEnemies);
setInterval(addscore, 1000);
setTimeout(makeEnemy, 1000);
draw();
