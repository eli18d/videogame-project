const enemies = [];

class Player {
    constructor() {
        this.width = 4;
        this.height = 8;
        this.positionX = 50 - (this.width / 2);
        this.positionY = 50 - (this.height / 2);
        this.speed = 50;
        this.keyStates = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false
        };
        this.lastTime = performance.now();
        this.updateUI();
        this.gameLoop();
    }

    checkCollisions() {
        enemies.forEach(enemy => {
            if (this.isCollidingWith(enemy)) {
                console.log("Collision detected!");
                location.href = "gameover.html";
            }
        });
    }

    isCollidingWith(enemy) {
        const playerLeft = this.positionX;
        const playerRight = this.positionX + this.width;
        const playerTop = this.positionY + this.height;
        const playerBottom = this.positionY;
    
        const enemyLeft = enemy.positionX;
        const enemyRight = enemy.positionX + enemy.width;
        const enemyTop = enemy.positionY + enemy.height;
        const enemyBottom = enemy.positionY;
    
        return (
            playerLeft < enemyRight &&
            playerRight > enemyLeft &&
            playerTop > enemyBottom &&
            playerBottom < enemyTop
        );
    }

    gameLoop(currentTime = performance.now()) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        let moveX = 0;
        let moveY = 0;
        
        if (this.keyStates.ArrowLeft) moveX -= 1;
        if (this.keyStates.ArrowRight) moveX += 1;
        if (this.keyStates.ArrowUp) moveY += 1;
        if (this.keyStates.ArrowDown) moveY -= 1;
        
        if (moveX !== 0 && moveY !== 0) {
            const len = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX /= len;
            moveY /= len;
        }
        
        this.positionX += moveX * this.speed * deltaTime;
        this.positionY += moveY * this.speed * deltaTime;
        
        this.checkCollisions();
        this.updateUI();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    updateUI() {
        const playerElm = document.getElementById("player");
        playerElm.style.width = this.width + "vw";
        playerElm.style.height = this.height + "vh";
        playerElm.style.left = this.positionX + "vw";
        playerElm.style.bottom = this.positionY + "vh";
    }
}

// Create player instance
const player = new Player();

document.addEventListener("keydown", (e) => {
    if (player.keyStates.hasOwnProperty(e.code)) {
        player.keyStates[e.code] = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (player.keyStates.hasOwnProperty(e.code)) {
        player.keyStates[e.code] = false;
    }
});



class Enemy {
    constructor(player) {
        this.width = 5;
        this.height = 9;
        this.speed = 30;
        this.enemyElement = null;
        this.player = player;

        // Generate position that's not too close to player
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 100;
        const minDistance = 20; // Minimum distance from player in vw/vh units

        while (!validPosition && attempts < maxAttempts) {
            attempts++;
            
            // Generate random position
            this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
            this.positionY = Math.floor(Math.random() * (100 - this.height + 1));
            
            // Calculate distance to player
            const dx = this.positionX - player.positionX;
            const dy = this.positionY - player.positionY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if position is valid (far enough from player)
            validPosition = distance > minDistance;
            
            // If we've tried too many times, just accept any position
            if (attempts >= maxAttempts) {
                console.warn("Couldn't find ideal enemy position after max attempts");
                validPosition = true;
            }
        }

        this.createDomElement();
        this.updateUI();
    }

    createDomElement() {
        this.enemyElement = document.createElement("div");
        this.enemyElement.className = "enemy";
        document.getElementById("board").appendChild(this.enemyElement);
    }

    updateUI() {
        this.enemyElement.style.width = this.width + "vw";
        this.enemyElement.style.height = this.height + "vh";
        this.enemyElement.style.left = this.positionX + "vw";
        this.enemyElement.style.bottom = this.positionY + "vh";
    }
}



// Spawn enemies
function spawnEnemies(count, player) {
    for (let i = 0; i < count; i++) {
        enemies.push(new Enemy(player));
    }
}


spawnEnemies(6, player);








