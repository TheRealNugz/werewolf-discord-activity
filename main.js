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

  alert("Game starting! (Next: role assignment)");
  // TODO: Transition to role assignment and game logic
});

function renderPlayers() {
  playerList.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p.name;
    playerList.appendChild(li);
  });
}
