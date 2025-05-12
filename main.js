import Seer from "./roles/seer.js";
import Villager from "./roles/villager.js";
import Werewolf from "./roles/werewolf.js";

// Load the config
let config = {};
fetch("config.json")
  .then((response) => response.json())
  .then((data) => {
    config = data;
    console.log("Config loaded:", config);
    // Now you can apply settings after loading the config
    setupGame();
  })
  .catch((error) => console.error("Error loading config:", error));

let players = [];
let joined = false;
const maxPlayers = 10;

// Get HTML elements
const joinBtn = document.getElementById("join-btn");
const startBtn = document.getElementById("start-game");
const playerList = document.getElementById("player-list");
const playerInput = document.getElementById("player-name");
const joinSection = document.getElementById("join-section");
const lobby = document.getElementById("lobby");
const playerCount = document.getElementById("player-count");
const lobbyMusic = document.getElementById("lobby-music");
const muteToggle = document.getElementById("mute-toggle");

let gameState = "lobby";
let werewolfVotes = [];
let seerVote = null;
let villagerVotes = [];
let voteSkipped = false;

let werewolfTimer = config.roleTimes.werewolf; // 3 minutes
let seerTimer = config.roleTimes.seer; // 3 minutes
let villagerTimer = config.roleTimes.villager; // 5 minutes

function setupGame() {
  // If in debug mode, automatically add 2 extra players after you join
  if (config.debugMode) {
    players.push(...config.debugPlayers);
  }
  renderPlayers();
}

// Join button listener
joinBtn.addEventListener("click", () => {
  const name = playerInput.value.trim();

  if (!name || joined) return;

  if (players.find((p) => p.name === name)) {
    alert("That name is already taken!");
    return;
  }

  players.push({ name });
  joined = true;

  // Play the music after a user joins
  lobbyMusic.volume = 0.5;
  lobbyMusic.currentTime = 0;
  lobbyMusic
    .play()
    .then(() => {
      console.log("Lobby music started");
    })
    .catch((err) => {
      console.warn("Autoplay failed:", err);
    });

  joinSection.classList.remove("active");
  lobby.classList.add("active");

  renderPlayers();

  if (players.length === 1) {
    startBtn.style.display = "inline-block";
  }

  updatePlayerCount();
});

// Mute/unmute button listener
muteToggle.addEventListener("click", () => {
  lobbyMusic.muted = !lobbyMusic.muted;
  muteToggle.textContent = lobbyMusic.muted
    ? "🔇 Unmute Music"
    : "🔊 Mute Music";
});

// Start button listener
startBtn.addEventListener("click", () => {
  if (players.length < 3) {
    alert("Need at least 3 players to start.");
    return;
  }

  assignRoles();
  renderRoles(); // temporary: shows roles for testing
  startGame();
});

// Render players in the lobby
function renderPlayers() {
  playerList.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p.name;
    playerList.appendChild(li);
  });
}

// Assign roles to players
function assignRoles() {
  const total = players.length;
  const numWerewolves = total >= 6 ? 2 : 1;
  const numSeers = 1;
  let roles = [];

  roles = roles.concat(Array(numWerewolves).fill(Werewolf));
  roles = roles.concat(Array(numSeers).fill(Seer));
  roles = roles.concat(Array(total - roles.length).fill(Villager));

  roles = shuffleArray(roles);

  players = players.map((p, i) => ({
    ...p,
    role: new roles[i](),
  }));
}

// Shuffle an array randomly
function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// Render the players with their roles
function renderRoles() {
  playerList.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.name} — ${p.role.config.name}`;
    playerList.appendChild(li);
  });

  startBtn.style.display = "none";
}

// Update the player count display
function updatePlayerCount() {
  playerCount.textContent = `Players: ${players.length}`;
}

// Game Start
function startGame() {
  gameState = "werewolf";
  werewolfVotes = [];
  villagerVotes = [];
  voteSkipped = false;

  // Start the game loop
  gameLoop();
}

// Update Timer Display (for each phase)
function updateTimer() {
  let timerDisplay = document.getElementById("timer-display");
  if (gameState === "werewolf") {
    timerDisplay.textContent = `Werewolf Voting: ${werewolfTimer}s`;
  } else if (gameState === "seer") {
    timerDisplay.textContent = `Seer: Choose who to check: ${seerTimer}s`;
  } else if (gameState === "villager") {
    timerDisplay.textContent = `Villager Voting: ${villagerTimer}s`;
  }
}

// Vote on who to kill (for Werewolves)
function voteWerewolf(playerName) {
  if (gameState !== "werewolf") return;
  if (werewolfVotes.includes(playerName)) return; // Prevent voting more than once

  werewolfVotes.push(playerName);
  console.log(`Werewolf voted for ${playerName}`);
  checkWerewolfVotes();
}

// Seer chooses who to check
function voteSeer(playerName) {
  if (gameState !== "seer") return;

  seerVote = playerName;
  console.log(`Seer chose to check ${playerName}`);
  revealSeerChoice();
}

// Villagers vote on who to kill (with a skip option)
function voteVillager(playerName) {
  if (gameState !== "villager") return;

  if (playerName === "skip") {
    voteSkipped = true;
    console.log("Villagers skipped voting.");
  } else if (!villagerVotes.includes(playerName)) {
    villagerVotes.push(playerName);
    console.log(`Villager voted for ${playerName}`);
  }
  checkVillagerVotes();
}

// Check if Werewolf vote has a winner
function checkWerewolfVotes() {
  if (werewolfVotes.length === 2) {
    // Assuming 2 werewolves
    const voteCounts = countVotes(werewolfVotes);
    const maxVotes = Math.max(...Object.values(voteCounts));
    const victims = Object.keys(voteCounts).filter(
      (v) => voteCounts[v] === maxVotes
    );

    if (victims.length === 1) {
      console.log(`${victims[0]} is killed by the Werewolves.`);
      // Handle death logic
    } else {
      console.log("No clear winner in Werewolf vote.");
    }
  }
}

// Check if Villager vote has a winner or was skipped
function checkVillagerVotes() {
  if (villagerVotes.length === players.length - 1 || voteSkipped) {
    const voteCounts = countVotes(villagerVotes);
    const maxVotes = Math.max(...Object.values(voteCounts));
    const victims = Object.keys(voteCounts).filter(
      (v) => voteCounts[v] === maxVotes
    );

    if (victims.length === 1) {
      console.log(`${victims[0]} is killed by the Villagers.`);
      // Handle death logic
    } else if (voteSkipped) {
      console.log("Villagers skipped voting.");
    } else {
      console.log("No clear winner in Villager vote.");
    }
  }
}

// Helper function to count votes
function countVotes(votes) {
  return votes.reduce((acc, vote) => {
    acc[vote] = (acc[vote] || 0) + 1;
    return acc;
  }, {});
}

// Reveal Seer’s choice after they check a player
function revealSeerChoice() {
  console.log(
    `${seerVote} is ${
      players.find((p) => p.name === seerVote)?.role === "Werewolf"
        ? "a Werewolf"
        : "not a Werewolf"
    }`
  );
}

// Update the state every second
function gameLoop() {
  setInterval(() => {
    if (gameState === "werewolf") {
      werewolfTimer--;
      if (werewolfTimer <= 0) {
        gameState = "seer";
        werewolfTimer = config.roleTimes.werewolf;
      }
    } else if (gameState === "seer") {
      seerTimer--;
      if (seerTimer <= 0) {
        gameState = "villager";
        seerTimer = config.roleTimes.seer;
      }
    } else if (gameState === "villager") {
      villagerTimer--;
      if (villagerTimer <= 0) {
        gameState = "werewolf";
        villagerTimer = config.roleTimes.villager;
      }
    }
    updateTimer();
  }, 1000);
}
