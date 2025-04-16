export class Player {
    constructor() {
        this.hitPoints = 5;
        this.lastHitTime = 0;
        this.immunityDuration = 2000; // 2 seconds of immunity after being hit
        this.width = 4;
        this.height = 8;
        this.positionX = 50 - (this.width / 2);
        this.positionY = 50 - (this.height / 2);
        this.speed = 45;
        this.keyStates = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false
        };

        this.attackRange = 15; // How close enemies need to be to hit them
     
        this.updateUI();
        
    }

    // Simple attack method
    attack(enemies) {
        enemies.forEach((enemy, index) => {
            // Calculate distance to enemy
            const distance = Math.sqrt(
                Math.pow(this.positionX - enemy.positionX, 2) + 
                Math.pow(this.positionY - enemy.positionY, 2)
            );
            
            // If enemy is in range, remove it
            if (distance < this.attackRange) {
                enemy.remove();   
                enemies.splice(index, 1);
                console.log("Enemy slain!");
            }
            
        });
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
    
        // Boundary checks
        this.positionX = Math.max(0, Math.min(100 - this.width, this.positionX));
        this.positionY = Math.max(0, Math.min(100 - this.height, this.positionY));
    
        this.updateUI();
        this.checkCollisions(enemies);
    }

    
    checkCollisions(enemies) {
       
      const currentTime = performance.now();

            enemies.forEach(enemy => {
                
                if (this.isCollidingWith(enemy)) {
                    if (currentTime - this.lastHitTime >= this.immunityDuration) {
                        console.log(this.hitPoints);
                        this.hitPoints--;
                        this.lastHitTime = currentTime;
                    
                        if (this.hitPoints === 0) {
                            console.log("Collision detected!");
                            location.href = "gameover.html";
                        } else {
                            console.log("hello where am i?");
                        }
                    }
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

