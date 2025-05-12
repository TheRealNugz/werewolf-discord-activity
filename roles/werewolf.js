export default class Werewolf {
  constructor(player) {
    this.name = player.name;
    this.role = "Werewolf";
    this.config = {
      name: "Werewolf",
      image: "images/werewolf.png",
      description: "Eliminates a player each night.",
    };
  }

  nightAction(players) {
    console.log(`${this.name} (Werewolf) is choosing someone to eliminate...`);
  }
}
