import Phaser from "phaser";

/** @type { Phaser.Types.Physics.Arcade.SpriteWithDynamicBody } */
let werewolf;

/** @type { Phaser.Types.Input.Keyboard.CursorKeys } */
let cursors;

class Scene extends Phaser.Scene
{
  constructor()
  {
    super();
  }

  preload()
  {
    this.load.atlas('werewolf', 'images/werewolf.png', 'images/werewolf.json');
  }

  create()
  {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('werewolf', {start: 1, end: 3, prefix: 'idle-'}),
      repeat: -1,
      frameRate: 5,
    });

    this.anims.create({
      key: 'death',
      frames: this.anims.generateFrameNames('werewolf', {start: 1, end: 10, prefix: 'death-'}),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('werewolf', {start: 1, end: 5, prefix: 'walk-'}),
      repeat: -1,
      frameRate: 8,
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNames('werewolf', {start: 1, end: 6, prefix: 'jump-'}),
      frameRate: 10,
    });

    werewolf = this.physics.add.sprite(400, 300, 'werewolf');
    werewolf.body.syncBounds = true;
    werewolf.setCollideWorldBounds(true).setBounce(0).setScale(3).play('idle');

    cursors = this.input.keyboard.createCursorKeys();
  }

  update()
  {
    if (cursors.up.isDown && werewolf.body.onFloor()) {
      if (werewolf.anims.getFrameName() == 'jump-4') {
        werewolf.setVelocityY(-400);
      }
      werewolf.play('jump', true);
    } else {
      if (cursors.left.isDown) {
        werewolf.setVelocityX(-200).setFlipX(false);
      } else if (cursors.right.isDown) {
        werewolf.setVelocityX(200).setFlipX(true);
      } else {
        werewolf.setVelocityX(0);
      }

      if (werewolf.body.onFloor()) {
        if (werewolf.body.velocity.x != 0) {
          werewolf.play('walk', true);
        } else {
          werewolf.play('idle', true).setGravityY(0);
        }
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },
  pixelArt: true,
  scene: Scene,
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

const game = new Phaser.Game(config);
