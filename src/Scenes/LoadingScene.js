import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
  }

  preload() {
    let text = this.add.text(0, 0, 'Loading...', {color: '#000000'});
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(200, 400, 400, 50);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x000000, 1);
      progressBar.fillRect(210, 410, 380 * value, 30);
    });

    this.load.on('fileprogress', (file) => {
      text.setText('Loading: ' + file.key);
    });

    // Load assets
    this.load.atlas("outside", "images/outside.png", "images/outside.json");
    this.load.atlas("roxy", "images/roxy.png", "images/roxy.json");
  }

  create() {
    // Bắt đầu game
    this.scene.start("GameScene");
  }
}
