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

// Event listener for the join button
joinBtn.addEventListener("click", () => {
  console.log("Join button clicked!"); // Check if the event listener is triggered
  const name = playerInput.value.trim();

  // Prevent joining if the name is empty or the player has already joined
  if (!name || joined) {
    console.log("Either name is empty or already joined.");
    return;
  }

  // Check if the name already exists
  if (players.find((p) => p.name === name)) {
    alert("That name is already taken!");
    return;
  }

  // Add the first player to the list
  players.push({ name });
  joined = true;

  // Auto-join two more players after the first one joins
  autoJoinPlayers();

  // Update UI
  joinSection.style.display = "none";
  lobby.style.display = "block";
  renderPlayers();

  console.log("Lobby is now visible with players:", players); // Check the players array

  // Show start button if there are 3 or more players
  if (players.length >= 3) {
    startBtn.style.display = "inline-block"; // Show start button when there are 3 or more players
    console.log("Start button is visible");
  }
});

// Function to automatically add 2 more players when the first player joins
function autoJoinPlayers() {
  // If less than 3 players, auto-join two additional players
  if (players.length === 1 && players.length + 2 <= maxPlayers) {
    players.push({ name: "Player 2" }); // Add second player
    players.push({ name: "Player 3" }); // Add third player
    console.log("Two additional players have joined: Player 2 and Player 3");
  }
}

// Event listener for the start button
startBtn.addEventListener("click", () => {
  console.log("Start button clicked"); // Check if the start button is triggered
  if (players.length < 3) {
    alert("Need at least 3 players to start.");
    return;
  }

  assignRoles();
  renderRoles(); // temp: show everyone’s role (for testing)
});

// Reset logic to allow for new games (for testing)
function resetGame() {
  players = [];
  joined = false;
  joinSection.style.display = "block";
  lobby.style.display = "none";
  startBtn.style.display = "none";
  playerInput.value = "";
  renderPlayers();
  console.log("Game reset!");
}

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

// Reset game functionality for testing
// Uncomment below to test a reset after starting
// setTimeout(() => {
//   resetGame();
// }, 10000);
