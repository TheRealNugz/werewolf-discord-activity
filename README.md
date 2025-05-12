# Werewolf Game

A fun and interactive multiplayer game based on the classic social deduction game "Werewolf," built using JavaScript, HTML, and CSS. Players take on the roles of different characters, including Werewolves, Villagers, and Seers, and vote to eliminate each other in a battle of wits.

**Note**: This project includes a Discord activity integration, but it is still being worked on and is not yet fully functional.

## Features

- Multiple roles: Werewolf, Villager, Seer, and more.
- Dynamic role assignment at the start of each game.
- Time limits for each role's actions (Werewolf, Seer, Villagers).
- Lobby system where players can join and start a game.
- Background music in the lobby.
- Mute/unmute toggle for lobby music.
- Debug mode with additional players for testing purposes.

## Roles and Times

- **Werewolf**: Has 3 minutes to vote for the victim.
- **Seer**: Has 3 minutes to choose someone to look at.
- **Villager**: Has 5 minutes to vote for a victim or skip voting.

You can adjust these times via the `config.json` file.

## Setup

To get started with the game on your local machine:

1. Clone the repository:
   ```bash
   git clone https://github.com/TheRealNugz/werewolf-discord-activity.git
