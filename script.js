const colors = ["red", "green", "blue", "yellow"];
const gameButtons = document.querySelectorAll(".game-button");
const startButton = document.getElementById("start-button");
const roundCounterDisplay = document.getElementById("round-counter");
const winMessage = document.getElementById("win-message");

let gameSequence = [];
let playerSequence = [];
let round = 0;
let canClick = false; // Prevents player from clicking during sequence display

// --- Audio Setup (Optional but recommended for Simon Says) ---
// You would need to provide these sound files (e.g., .mp3 or .wav)
// For simplicity, we'll just log which sound would play.
function playSound(color) {
    // In a real game, you'd load and play audio files here:
    // const audio = new Audio(`sounds/${color}.mp3`);
    // audio.play();
    console.log(`Playing sound for ${color}`);
}

// --- Game Logic ---

function startGame() {
    startButton.classList.add("hidden"); // Hide start button
    winMessage.classList.add("hidden"); // Hide win message if visible
    gameSequence = [];
    playerSequence = [];
    round = 0;
    roundCounterDisplay.textContent = round;
    setTimeout(nextRound, 500); // Start the first round after a brief delay
}

function nextRound() {
    canClick = false;
    playerSequence = [];
    round++;
    roundCounterDisplay.textContent = round;

    // Add a new random color to the game sequence
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);

    displaySequence();
}

function displaySequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i < gameSequence.length) {
            const button = document.getElementById(gameSequence[i]);
            lightUpButton(button);
            playSound(gameSequence[i]); // Play sound for the color
            i++;
        } else {
            clearInterval(interval);
            canClick = true; // Allow player to click after sequence is shown
            // Optionally, give a visual cue that it's the player's turn
            // e.g., change border color of game board, or display "Your Turn"
        }
    }, 600); // Time between flashes
}

function lightUpButton(button) {
    button.classList.add("active");
    setTimeout(() => {
        button.classList.remove("active");
    }, 300); // How long the button stays lit
}

function handlePlayerClick(event) {
    if (!canClick) return; // Ignore clicks if not player's turn

    const clickedColor = event.target.id;
    playerSequence.push(clickedColor);
    lightUpButton(event.target); // Light up the clicked button
    playSound(clickedColor); // Play sound for player's click

    checkPlayerSequence();
}

function checkPlayerSequence() {
    const lastPlayerIndex = playerSequence.length - 1;

    // 1. Check if the last clicked color is correct
    if (playerSequence[lastPlayerIndex] !== gameSequence[lastPlayerIndex]) {
        gameOver();
        return;
    }

    // 2. Check if the player has completed the current round sequence
    if (playerSequence.length === gameSequence.length) {
        if (round === 10) { // Check for winning condition
            gameWon();
            return;
        }
        // If correct and not won yet, move to the next round after a short delay
        setTimeout(nextRound, 1000);
    }
}

function gameOver() {
    canClick = false;
    alert(`Game Over! You reached Round ${round}. Try again!`);
    startButton.textContent = "Play Again"; // Change button text
    startButton.classList.remove("hidden"); // Show start button
    // Optionally add a red flash to all buttons or a "Game Over" visual
}

function gameWon() {
    canClick = false;
    roundCounterDisplay.textContent = 10; // Ensure it shows 10 rounds
    winMessage.classList.remove("hidden"); // Show the winning message and image
    startButton.textContent = "Play Again";
    startButton.classList.remove("hidden");
    // Optionally, disable button clicks until the game restarts
}

// --- Event Listeners ---
startButton.addEventListener("click", startGame);

gameButtons.forEach(button => {
    button.addEventListener("click", handlePlayerClick);
});

// Initial state
roundCounterDisplay.textContent = round;