import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

// Game state
let currentLevel = 1;
window.enemies = [];
const player = new Player();




// DOM elements
const levelCleared = document.getElementById("levelCleared");
const levelDisplay = document.getElementById("levelDisplay");
const countdown = document.getElementById("countdown");
const instructions = document.getElementById("instructions");
const countdown2 = document.getElementById("countdown2");

    
let countdown2Value = 3;
countdown2.textContent = countdown2Value;

function instructionWithCountdown(value) {
    // Update the display with current number
    countdown2.textContent = value;
    
    
    if (value > 0) {
        
        setTimeout(function() {
            instructionWithCountdown(value - 1);
           
        }, 1000);
    } else {
        
        //REMOVE THIS ANNOYING DIV
        instructions.remove();
        
        startLevel();
        
    }
}


instructionWithCountdown(countdown2Value);




// Event listeners 
document.addEventListener("keydown", (e) => {
   
    if (player.keyStates.hasOwnProperty(e.code)) {
        player.keyStates[e.code] = true;
    }

    if (e.code === "Space") {
        player.attack(enemies);
    }

    if (e.code === "ShiftLeft"){
        console.log("dash?")
        player.startDash();
    }
});



document.addEventListener("keyup", (e) => {
    if (player.keyStates.hasOwnProperty(e.code)) {
        player.keyStates[e.code] = false;
    }
});

// Spawn enemies and adds more as levels increase
function spawnEnemies() {
    const enemyCount = 7 + currentLevel * 5; // Scale enemy count with level
    for (let i = 0; i < enemyCount; i++) {
        enemies.push(new Enemy(player));
    }

    levelDisplay.textContent = `Level ${currentLevel}`;
    
}


function startLevel() {
    
    spawnEnemies();

   
   
    requestAnimationFrame(gameLoop);
}

// Level completion handler
function completeLevel() {
    currentLevel++;
    levelCleared.style.display = "block";
    
    let countdownValue = 5;
    countdown.textContent = countdownValue;

    function runCountdown(value) {
        // Update the display with current number
        countdown.textContent = value;
        
        
        if (value > 0) {
            
            setTimeout(function() {
                runCountdown(value - 1);
            }, 1000);
        } else {
           
            levelCleared.style.display = "none";
            
            startLevel();
        }
    }
    
    // Start the countdown
    runCountdown(countdownValue);
}

// Main game loop 
function gameLoop(timestamp) {
  
    
    player.move(enemies, timestamp);
    
    enemies.forEach((enemy) => {
        enemy.move(timestamp);
    });
    
    // Check level completion
    if (enemies.length === 0) {
        completeLevel();
        return;          // it's 23hs, not exactly sure why but THIS IS NEEDED or game will crash. 
    }
    
    requestAnimationFrame(gameLoop);
}

// Initialize game
