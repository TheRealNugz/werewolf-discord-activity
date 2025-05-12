import Seer from "./roles/seer.js";
import Villager from "./roles/villager.js";
import Werewolf from "./roles/werewolf.js";

const maxPlayers = 10;
let players = [];
let joined = false;

const joinBtn = document.getElementById("join-btn");
const startBtn = document.getElementById("start-game");
const playerList = document.getElementById("player-list");
const playerInput = document.getElementById("player-name");
const joinSection = document.getElementById("join-section");
const lobby = document.getElementById("lobby");
const playerCount = document.getElementById("player-count");

// Background music element and mute button
const lobbyMusic = document.getElementById("lobby-music");
const muteToggle = document.getElementById("mute-toggle");

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
