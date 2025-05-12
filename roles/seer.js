export default class Seer {
  constructor(player) {
    this.name = player.name;
    this.role = "Seer";
    this.config = {
      name: "Seer",
      image: "images/seer.png",
      description: "Can inspect one player per night.",
    };
  }

  nightAction(players) {
    console.log(`${this.name} (Seer) is inspecting another player...`);
  }
}
