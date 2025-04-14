import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

window.enemies = []; // Global reference (not ideal but works for now)
const player = new Player();

// Event listeners for keyboard input
document.addEventListener("keydown", (e) => {
    if (player.keyStates.hasOwnProperty(e.code)) {
        player.keyStates[e.code] = true;
    }

    // Spacebar triggers attack
    if (e.code === "Space") {
        player.attack(enemies);
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

// Single game loop with delta-time
function gameLoop(timestamp) {
    player.move(enemies, timestamp); // Pass both enemies and timestamp
    requestAnimationFrame(gameLoop);
}

// Initialize game
spawnEnemies(6, player);
gameLoop(); // Start the game loop

