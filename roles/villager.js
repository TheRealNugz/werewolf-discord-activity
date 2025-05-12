export default class Villager {
  constructor(player) {
    this.name = player.name;
    this.role = "Villager";
    this.config = {
      name: "Villager",
      image: "images/villager.png",
      description: "No special ability. Votes during the day.",
    };
  }

  nightAction() {
    console.log(`${this.name} (Villager) is sleeping.`);
  }
}
