import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

// Game state
let currentLevel = 1;
window.enemies = [];
const player = new Player();

const bgMusic = document.getElementById('bgMusic');

startMusic();

function startMusic() {
  bgMusic.volume = 0.3; // Set volume (0.0 to 1.0)
  bgMusic.play().catch(e => console.log("Audio play failed:", e));
}

document.body.addEventListener('click', () => {
    startMusic();
    document.body.removeEventListener('click', startMusic); // Remove after first click
  }, { once: true });
  


// DOM elements

const canvas = document.getElementById('gameCanvas'); // Make sure your HTML has <canvas id="gameCanvas">
const ctx = canvas.getContext('2d');


const levelCleared = document.getElementById("levelCleared");
const levelDisplay = document.getElementById("levelDisplay");
const countdown = document.getElementById("countdown");
const instructions = document.getElementById("instructions");
const countdown2 = document.getElementById("countdown2");


    
let countdown2Value = 6;
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
    
    let countdownValue = 2;
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
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.move(enemies, timestamp);
   
    player.drawHealthBar(ctx);  
    player.checkCollisions(enemies, ctx);
   
    


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
