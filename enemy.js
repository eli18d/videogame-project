export class Enemy {
    constructor(player) {
        this.width = 5;
        this.height = 9;
        this.speed = 20;
        this.enemyElement = null;
        this.player = player;
        this.lastTime = 0; 
        this.followingRange = 20;

        // Generate position that's not too close to player
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 100;
        const minDistance = 20;

        while (!validPosition && attempts < maxAttempts) {
            attempts++;
            this.positionX = Math.floor(Math.random() * (100 - this.width + 1));
            this.positionY = Math.floor(Math.random() * (70 - this.height + 1));
            
            const dx = this.positionX - player.positionX;
            const dy = this.positionY - player.positionY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            validPosition = distance > minDistance;
            
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

    remove() {
        this.enemyElement.remove();
        this.updateUI();
    }

    move(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        const direction = this.calculateDirectionToPlayer();
        
        // Apply movement with delta time
        this.positionX += direction.x * dt;
        this.positionY += direction.y * dt;

        if (direction.x < 0) {
            this.enemyElement.classList.add("flipped");  
        } else {
            this.enemyElement.classList.remove("flipped"); 
        }

        const minDistance = 6; // Minimum space between enemies
        window.enemies.forEach(enemy => {
        if (enemy === this) return; // Skip self
        
        const dx = this.positionX - enemy.positionX;
        const dy = this.positionY - enemy.positionY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance) {
            // Push away proportionally to how close they are
            const pushForce = (minDistance - distance) / minDistance;
            this.positionX += (dx / distance) * pushForce * 7;
            this.positionY += (dy / distance) * pushForce * 7;
        }
    });

        // Boundary constraints
        this.positionX = Math.max(0, Math.min(100 - this.width, this.positionX));
        this.positionY = Math.max(0, Math.min(100 - this.height, this.positionY));

        this.updateUI();
    }

    calculateDirectionToPlayer() {
        const dx = this.player.positionX - this.positionX;
        const dy = this.player.positionY - this.positionY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return { x: 0, y: 0 };

        // Return normalized direction multiplied by speed
        return {
            x: (dx / distance) * this.speed,
            y: (dy / distance) * this.speed
        };
    }

    updateUI() {
        this.enemyElement.style.width = this.width + "vw";
        this.enemyElement.style.height = this.height + "vh";
        this.enemyElement.style.left = this.positionX + "vw";
        this.enemyElement.style.bottom = this.positionY + "vh";
    }
}