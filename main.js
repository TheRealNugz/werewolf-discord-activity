const CLIENT_ID = "1371372155341639771"; // Replace with your Discord app's ID
const discord = new DiscordSDK(CLIENT_ID);

let userList = [];
let gameStarted = false;

async function init() {
  await discord.ready();

  const { access_token } = await discord.commands.authorize({
    client_id: CLIENT_ID,
    scopes: [
      "identify",
      "rpc",
      "messages.read",
      "activities.read",
      "activities.write",
    ],
  });

  await discord.commands.authenticate({ access_token });

  discord.commands.subscribe("ACTIVITY_JOIN", ({ secret }) => {
    console.log("Player joined with secret:", secret);
  });

  discord.commands.subscribe("GAME_MESSAGE", ({ message }) => {
    if (message.type === "player_list") {
      updateUserList(message.data);
    }
  });

  document.getElementById("start-game").onclick = () => {
    if (!gameStarted) {
      gameStarted = true;
      assignRoles();
    }
  };

  sendPlayerJoined();
}

function sendPlayerJoined() {
  const playerId = Math.random().toString(36).substr(2, 9);
  const playerName = "Player_" + Math.floor(Math.random() * 1000);

  const newPlayer = { id: playerId, name: playerName };
  userList.push(newPlayer);

  discord.commands.sendGameMessage({
    type: "player_list",
    data: userList,
  });

  updateUserList(userList);
}

function updateUserList(players) {
  const container = document.getElementById("user-list");
  container.innerHTML = "";
  players.forEach((p) => {
    const div = document.createElement("div");
    div.textContent = p.name;
    container.appendChild(div);
  });
}

function assignRoles() {
  const roles = ["werewolf", "seer"];
  while (roles.length < userList.length) {
    roles.push("villager");
  }

  const shuffledRoles = roles.sort(() => Math.random() - 0.5);

  userList.forEach((player, index) => {
    const role = shuffledRoles[index];
    // For now, just log to console
    console.log(`${player.name} is assigned role: ${role}`);
  });
}

init();
