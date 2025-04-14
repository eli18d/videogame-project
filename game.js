import {Player} from "./player.js"
import {Enemy} from "./enemy.js"

window.enemies = [];

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

// Spawn enemies
function spawnEnemies(count, player) {
    for (let i = 0; i < count; i++) {
        enemies.push(new Enemy(player));
    }
}


// Game loop
function gameLoop() {
    player.move();
    // You might also want to move enemies here if they're not moving themselves
    requestAnimationFrame(gameLoop);
}

// Initialize game
spawnEnemies(6, player);
gameLoop(); // Start the game loop

