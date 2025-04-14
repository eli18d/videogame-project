export class Player {
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
     
        this.updateUI();
        
    }

    move(enemies, timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = (timestamp - this.lastTime) / 1000; // Delta time in seconds
        this.lastTime = timestamp;
    
        const distance = this.speed * dt; // Movement scaled by time
    
        if (this.keyStates.ArrowLeft) this.positionX -= distance;
        if (this.keyStates.ArrowRight) this.positionX += distance;
        if (this.keyStates.ArrowUp) this.positionY += distance;
        if (this.keyStates.ArrowDown) this.positionY -= distance;
    
        // Boundary checks (optional)
        this.positionX = Math.max(0, Math.min(100 - this.width, this.positionX));
        this.positionY = Math.max(0, Math.min(100 - this.height, this.positionY));
    
        this.updateUI();
        this.checkCollisions(enemies);
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

    

    updateUI() {
        const playerElm = document.getElementById("player");
        playerElm.style.width = this.width + "vw";
        playerElm.style.height = this.height + "vh";
        playerElm.style.left = this.positionX + "vw";
        playerElm.style.bottom = this.positionY + "vh";
    }
}

