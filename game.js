import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

// Game state
let currentLevel = 1;
window.enemies = [];
const player = new Player();


// Event listeners 
document.addEventListener("keydown", (e) => {
   
    if (player.keyStates.hasOwnProperty(e.code)) {
        player.keyStates[e.code] = true;
    }

    if (e.code === "Space") {
        player.attack(enemies);
    }
});

document.addEventListener("keyup", (e) => {
    if (player.keyStates.hasOwnProperty(e.code)) {
        player.keyStates[e.code] = false;
    }
});

// Spawn enemies and adds more as levels increase
function spawnEnemies() {
    const enemyCount = 5 + currentLevel * 2; // Scale enemy count with level
    for (let i = 0; i < enemyCount; i++) {
        enemies.push(new Enemy(player));
    }
    
}


function startLevel() {
    
    spawnEnemies();
   
    requestAnimationFrame(gameLoop);
}

// Level completion handler
function completeLevel() {
   
    currentLevel++;
   
    // start next level after 5 seconds
    setTimeout(() => {
    
        startLevel();
    }, 5000); 
}

// Main game loop 
function gameLoop(timestamp) {
  
    
    player.move(enemies, timestamp);
    
    // Check level completion
    if (enemies.length === 0) {
        completeLevel();
        return;          // it's 23hs, not exactly sure why but THIS IS NEEDED or game will crash. 
    }
    
    requestAnimationFrame(gameLoop);
}

// Initialize game
startLevel();