export class Enemy {
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

    remove() {
        this.enemyElement.remove();
    }
}