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

console.log("JavaScript is working"); // Check if JS is loaded

joinBtn.addEventListener("click", () => {
  console.log("Join button clicked!"); // Check if the event listener is triggered
  const name = playerInput.value.trim();
  if (!name || joined) return;

  // Check if name already exists
  if (players.find((p) => p.name === name)) {
    alert("That name is already taken!");
    return;
  }

  // Add player to the list
  players.push({ name });
  joined = true;

  // Update UI
  joinSection.style.display = "none";
  lobby.style.display = "block";
  renderPlayers();

  console.log("Lobby is now visible with players:", players); // Check the players array

  // Show start button if it's the first player
  if (players.length === 1) {
    startBtn.style.display = "inline-block"; // First player is host
    console.log("Start button is visible for host");
  }
});

startBtn.addEventListener("click", () => {
  console.log("Start button clicked"); // Check if the start button is triggered
  if (players.length < 3) {
    alert("Need at least 3 players to start.");
    return;
  }

  assignRoles();
  renderRoles(); // temp: show everyone’s role (for testing)
});

function renderPlayers() {
  console.log("Rendering players"); // Debug line to confirm function is running
  playerList.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p.name;
    playerList.appendChild(li);
  });

  console.log("Players rendered:", players); // Check what players are rendered in the list
}

function assignRoles() {
  console.log("Assigning roles"); // Debug line to confirm function is running
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
    role: new roles[i](), // Make sure roles are instantiated here
  }));

  console.log("Roles assigned:", players); // Log players with their assigned roles
}

function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function renderRoles() {
  console.log("Rendering roles"); // Debug line to confirm function is running
  playerList.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.name} — ${p.role.config.name}`; // Show the role's name
    playerList.appendChild(li);
  });

  console.log("Roles rendered:", players); // Log the players with their roles

  startBtn.style.display = "none"; // Hide the start button after the game starts
}
