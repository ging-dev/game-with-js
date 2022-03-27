import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor () {
    super("GameScene");
  }

  init() {
    this.pointer = this.input.activePointer;
  }

  create() {
    this.anims.create({
      'key': 'guest-1',
      'frames': this.anims.generateFrameNames('outside', {start: 1, end: 2}),
      'frameRate': 2,
      'repeat': -1
    });

    this.anims.create({
      'key': 'guest-2',
      'frames': this.anims.generateFrameNames('outside', {start: 3, end: 4}),
      'frameRate': 2,
      'repeat': -1
    });

    this.anims.create({
      'key': 'guest-3',
      'frames': this.anims.generateFrameNames('outside', {start: 5, end: 6}),
      'frameRate': 2,
      'repeat': -1
    });

    this.anims.create({
      'key': 'roxy-move',
      'frames': this.anims.generateFrameNames('roxy', {start: 1, end: 3, prefix: 'move-'}),
      'frameRate': 5,
      'repeat': -1
    });

    this.add.tileSprite(0, 0, 800, 128, "outside", "sky").setTileScale(2).setOrigin(0, 0);
    this.add.tileSprite(0, 110, 800, 156, "outside", "bg").setTileScale(2).setOrigin(0, 0);
    this.add.tileSprite(0, 0, 800, 336, "outside", "airplane").setTileScale(1.5).setOrigin(0, 0);
    this.add.image(0, 250, "outside", "8").setOrigin(0, 1);
    this.add.sprite(312, 265).play('guest-1').setOrigin(0.5, 1);
    this.add.sprite(420, 265).play('guest-2').setOrigin(0.5, 1);
    this.add.sprite(200, 265).play('guest-3').setOrigin(0.5, 1);

    let roxy = this.physics.add.sprite(50, 200, "roxy").play('roxy-move').setOrigin(0.5, 1).on('animationupdate', () => {
      if (roxy.x < 50 || roxy.x > 750) {
        roxy.setFlipX(!roxy.flipX);
      }
      roxy.setVelocityX(roxy.flipX ? -100 : 100);
    });

    roxy.body.syncBounds = true;
    roxy.body.checkCollision.left = false;
    roxy.body.checkCollision.right = false;

    roxy.setCollideWorldBounds(true);

    let road = this.add.rectangle(0, 332, 800, 32, 0x000000, 0).setOrigin(0, 1);
    this.physics.add.existing(road, true);
    this.physics.world.setBoundsCollision(true);
    this.physics.add.collider(roxy, road);
  }

  update() {
    if (this.pointer.isDown) {
      console.log("Clicked", this.pointer.x, this.pointer.y);
    }
  }
}
