const singleBtn = document.getElementById("singlePlayerBtn");
const twoBtn = document.getElementById("twoPlayerBtn");
const startBtn = document.getElementById("startGameBtn");
const rollBtn = document.getElementById("rollDiceBtn");

const player1Status = document.getElementById("player1Status");
const player2Status = document.getElementById("player2Status");
const diceValue = document.getElementById("diceValue");
const logText = document.getElementById("logText");

let gameMode = null;
let player1 = { name: "", position: 1 };
let player2 = { name: "", position: 1, isBot: false };
let currentPlayer = 1;
let gameStarted = false;

// Ladders and Snakes (just a few, you can expand)
const ladders = {
  3: 22,
  5: 8,
  11: 26,
  20: 29
};

const snakes = {
  27: 1,
  21: 9,
  17: 4,
  19: 7
};

// Mode selection
singleBtn.addEventListener("click", () => {
  gameMode = "single";
  player2.isBot = true;
  logText.textContent = "Single Player Mode Selected";
});

twoBtn.addEventListener("click", () => {
  gameMode = "multi";
  player2.isBot = false;
  logText.textContent = "Two Player Mode Selected";
});

// Start game
startBtn.addEventListener("click", () => {
  const p1 = document.getElementById("player1Name").value || "Player 1";
  const p2 = document.getElementById("player2Name").value || (player2.isBot ? "Bot" : "Player 2");

  player1.name = p1;
  player2.name = p2;
  player1.position = 1;
  player2.position = 1;
  currentPlayer = 1;
  gameStarted = true;

  updateStatus();
  logText.textContent = `${player1.name} vs ${player2.name} — Game Started!`;
});

// Roll Dice
rollBtn.addEventListener("click", () => {
  if (!gameStarted) {
    logText.textContent = "Please start the game!";
    return;
  }

  const roll = Math.floor(Math.random() * 6) + 1;
  diceValue.textContent = roll;

  if (currentPlayer === 1) {
    movePlayer(player1, roll);
    if (roll !== 6) currentPlayer = 2;
  } else {
    movePlayer(player2, roll);
    if (roll !== 6) currentPlayer = 1;
  }

  updateStatus();

  // Bot logic
  if (player2.isBot && currentPlayer === 2) {
    setTimeout(() => {
      const botRoll = Math.floor(Math.random() * 6) + 1;
      diceValue.textContent = botRoll;
      movePlayer(player2, botRoll);
      if (botRoll !== 6) currentPlayer = 1;
      updateStatus();
    }, 1000);
  }
});

// Move logic
function movePlayer(player, roll) {
  let newPos = player.position + roll;

  if (newPos > 100) {
    logText.textContent = `${player.name} needs exact number to reach 100!`;
    return;
  }

  // Ladder climb
  if (ladders[newPos]) {
    logText.textContent = `${player.name} climbed a ladder from ${newPos} to ${ladders[newPos]}!`;
    newPos = ladders[newPos];
  }

  // Snake bite
  else if (snakes[newPos]) {
    logText.textContent = `${player.name} got bitten by a snake from ${newPos} to ${snakes[newPos]}!`;
    newPos = snakes[newPos];
  }

  player.position = newPos;

  // Win check
  if (newPos === 100) {
    gameStarted = false;
    logText.textContent = `🎉 ${player.name} wins the game! 🎉`;
  }
}

// Update UI
function updateStatus() {
  player1Status.textContent = `${player1.name}: Position ${player1.position}`;
  player2Status.textContent = `${player2.name}: Position ${player2.position}`;
}
