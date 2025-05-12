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

joinBtn.addEventListener("click", () => {
  const name = playerInput.value.trim();
  if (!name || joined) return;

  if (players.find((p) => p.name === name)) {
    alert("That name is already taken!");
    return;
  }

  players.push({ name });
  joined = true;

  joinSection.style.display = "none";
  lobby.style.display = "block";
  renderPlayers();

  if (players.length === 1) {
    startBtn.style.display = "inline-block"; // First player is host
  }
});

startBtn.addEventListener("click", () => {
  if (players.length < 3) {
    alert("Need at least 3 players to start.");
    return;
  }

  assignRoles();
  renderRoles(); // temp: show everyone’s role (for testing)
});

function renderPlayers() {
  playerList.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p.name;
    playerList.appendChild(li);
  });
}

function assignRoles() {
  const total = players.length;
  let numWerewolves = total >= 6 ? 2 : 1;
  let numSeers = 1;
  let roles = [];

  // Create role pool
  roles = roles.concat(Array(numWerewolves).fill(Werewolf));
  roles = roles.concat(Array(numSeers).fill(Seer));
  roles = roles.concat(Array(total - roles.length).fill(Villager));

  // Shuffle roles
  roles = shuffleArray(roles);

  // Assign roles to players
  players = players.map((p, i) => ({
    ...p,
    role: new roles[i](),
  }));
}

function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function renderRoles() {
  playerList.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.name} — ${p.role.config.name}`;
    playerList.appendChild(li);
  });

  startBtn.style.display = "none";
}
