export class Player {
    constructor() {
        this.hitPoints = 3;
        this.maxHitpoints = 3;
        this.lastHitTime = 0;
        this.immunityDuration = 3000; // 2 seconds of immunity after being hit
        this.width = 4;
        this.height = 8;
        this.positionX = 50 - (this.width / 2);
        this.positionY = 50 - (this.height / 2);
        this.speed = 45;
        this.keyStates = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false,
            ShiftLeft: false,
        };

        this.isDashing = false;
        this.dashSpeed = 150; // Much faster than normal speed
        this.dashDuration = 400; // 0.3 seconds
        this.dashCooldown = 1500; // 2 seconds cooldown
        this.lastDashTime = 0;
        this.dashDirection = { x: 0, y: 0 };

        this.attackRange = 10; 
     
        this.immunityEffectActive = false;

        
        
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
                 
                enemies.splice(index, 1);
                enemy.remove();  
                console.log(enemies.length);
                
            }
            
        });
    }

    startDash() {
        const currentTime = performance.now();
        
        // This or will dash with no cooldown
        if (this.isDashing || currentTime - this.lastDashTime < this.dashCooldown) {
            return;
        }

        // dash direction based on player movement
        this.dashDirection = { x: 0, y: 0 };
        
        if (this.keyStates.ArrowLeft) this.dashDirection.x = -1;
        if (this.keyStates.ArrowRight) this.dashDirection.x = 1;
        if (this.keyStates.ArrowUp) this.dashDirection.y = 1;
        if (this.keyStates.ArrowDown) this.dashDirection.y = -1;
        
        // if no direction keys pressed, dash forward default
        if (this.dashDirection.x === 0 && this.dashDirection.y === 0) {
            this.dashDirection.x = 1; // default to right
        }

        // start dash
        this.isDashing = true;
        this.lastDashTime = currentTime;
        this.lastHitTime = currentTime; // grant immunity
    }

    move(enemies, timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = (timestamp - this.lastTime) / 1000; // Delta time in seconds
        this.lastTime = timestamp;
    
    
        if (this.isDashing) {
            // Dash movement
            const distance = this.dashSpeed * dt;
            this.positionX += this.dashDirection.x * distance;
            this.positionY += this.dashDirection.y * distance;
            
            // Check if dash duration has elapsed
            if (timestamp - this.lastDashTime >= this.dashDuration) {
                this.isDashing = false;
                // Attack enemies at dash end position
                
                this.attack(enemies);
            }
        } else {
            // Normal movement
            const distance = this.speed * dt;
            
            if (this.keyStates.ArrowLeft) this.positionX -= distance;
            if (this.keyStates.ArrowRight) this.positionX += distance;
            if (this.keyStates.ArrowUp) this.positionY += distance;
            if (this.keyStates.ArrowDown) this.positionY -= distance;
        }
        // Boundary checks
        this.positionX = Math.max(0, Math.min(100 - this.width, this.positionX));
        this.positionY = Math.max(0, Math.min(70 - this.height, this.positionY));
    
        this.updateUI();
        this.checkCollisions(enemies);
        
    }

    
    checkCollisions(enemies, ctx) {
        
      const currentTime = performance.now();

            enemies.forEach(enemy => {
                
                if (this.isCollidingWith(enemy)) {
                    if (currentTime - this.lastHitTime >= this.immunityDuration) {
                        console.log(this.hitPoints);
                        this.hitPoints--;
                        this.lastHitTime = currentTime;
                        console.log("Collision detected!");
                    
                        if (this.hitPoints === 0) {
                            
                            location.href = "gameover.html";
                        } else {
                            
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

    

    drawHealthBar(ctx) {
        const barWidth = 200;
        const barHeight = 20;
        const x = 20; // Fixed position 
        const y = 20; // 
    
        // Main bar background 
        ctx.fillStyle = '#2a1e1a';
        ctx.fillRect(x, y, barWidth, barHeight);
    
        // Current health 
        const currentWidth = barWidth * (this.hitPoints / this.maxHitpoints);
        ctx.fillStyle = '#e63946';
        ctx.fillRect(x, y, currentWidth, barHeight);
    
        // Gold border
        ctx.strokeStyle = '#d4a373';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);
    
    
        // Text label 
        ctx.fillStyle = '#f8edeb';
        ctx.font = 'bold 14px "MS Gothic", "Courier New", monospace';
        ctx.textBaseline = 'top';
        ctx.fillText(
            `HP: ${this.hitPoints}/${this.maxHitpoints}`,
            x + 10,
            y + 3
        );
    }

    updateUI() {
        const playerElm = document.getElementById("player");
        playerElm.style.width = this.width + "vw";
        playerElm.style.height = this.height + "vh";
        playerElm.style.left = this.positionX + "vw";
        playerElm.style.bottom = this.positionY + "vh";
        
        // visual effect for dashing
        const currentTime = performance.now();
        const isDashingImmune = this.isDashing || (currentTime - this.lastDashTime < this.dashDuration + 500); // +500 little extra, looks nicer
        if (isDashingImmune) {
            
            // Flash effect - 
            const flashSpeed = 0.2; 
            const flashPhase = ((currentTime / 1000) % flashSpeed) / flashSpeed;
            
            if (flashPhase < 0.5) {
                playerElm.style.filter = "brightness(2) drop-shadow(0 0 10px black)";
            } else {
                playerElm.style.filter = "brightness(1.2) drop-shadow(0 0 3px white)";
            }
            playerElm.style.transition = "filter 0.05s";
        } else {
            playerElm.style.filter = "none";
            this.immunityEffectActive = false;
        }
    }

    
}

