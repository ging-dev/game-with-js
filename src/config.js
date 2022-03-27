import Phaser from "phaser"

export default {
  type: Phaser.AUTO,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 332,
  },
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300
      },
      debug: true,
    },
  },
}
