import config from "./config";
import Phaser from "phaser";
import LoadingScene from "./Scenes/LoadingScene";
import GameScene from "./Scenes/GameScene";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add("LoadingScene", LoadingScene);
    this.scene.add("GameScene", GameScene);
    this.scene.start("LoadingScene");
  }
}

window.game = new Game();
