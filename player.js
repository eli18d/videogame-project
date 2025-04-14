export class Player {
    constructor() {
        this.width = 4;
        this.height = 8;
        this.positionX = 50 - (this.width / 2);
        this.positionY = 50 - (this.height / 2);
        this.speed = 0.2;
        this.keyStates = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false
        };
     
        this.updateUI();
        
    }

    move() {
        if (this.keyStates.ArrowLeft) {
            this.positionX -= this.speed;
            // Prevent going off-screen left
            if (this.positionX < 0) this.positionX = 0;
        }
        if (this.keyStates.ArrowRight) {
            this.positionX += this.speed;
            // Prevent going off-screen right
            if (this.positionX > 100 - this.width) this.positionX = 100 - this.width;
        }
        if (this.keyStates.ArrowUp) {
            this.positionY += this.speed;
            // Prevent going off-screen top
            if (this.positionY > 100 - this.height) this.positionY = 100 - this.height;
        }
        if (this.keyStates.ArrowDown) {
            this.positionY -= this.speed;
            // Prevent going off-screen bottom
            if (this.positionY < 0) this.positionY = 0;
        }
        
        this.updateUI();
        this.checkCollisions();
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


