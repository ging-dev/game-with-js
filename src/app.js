import Phaser from "phaser";

class SimpleGame extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init() {
    this.player = null;
    this.key = this.input.keyboard.createCursorKeys();
    this.star = null;
    this.bombs = null;
    this.score = 0;
    this.scoreText = null;
  }

  preload() {
    this.load.image('sky', 'images/sky.png');
    this.load.image('ground', 'images/platform.png');
    this.load.image('star', 'images/star.png');
    this.load.image('bomb', 'images/bomb.png');
    this.load.spritesheet('player', 'images/player.png', {frameWidth: 48, frameHeight: 48});
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    const road = this.physics.add.staticGroup();
    road.create(400, 568, 'ground').setScale(2).refreshBody();
    road.create(600, 400, 'ground');
    road.create(50, 250, 'ground');

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      'key': 'idle',
      'frames': this.anims.generateFrameNumbers('player', {start: 5, end: 8}),
      'frameRate': 8,
      'repeat': -1
    });

    this.anims.create({
      'key': 'jump',
      'frames': this.anims.generateFrameNumbers('player', {start: 20, end: 23}),
      'frameRate': 8,
      'repeat': 0
    });

    this.player = this.physics.add.sprite(100, 450, 'player').play('idle');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, road);

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {x: 12, y: 0, stepX: 70}
    });

    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(this.stars, road);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, road);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0)
    {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      let x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      let bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
  }

  update() {
    if (this.key.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-330);
      this.player.play('jump', true);
    } else {
      if (this.key.left.isDown) {
        this.player.setFlipX(false).setVelocityX(-160);
      } else if (this.key.right.isDown) {
        this.player.setFlipX(true).setVelocityX(160);
      } else {
        this.player.setVelocityX(0);
      }

      if (this.player.body.onFloor()) {
        if (this.player.body.velocity.x != 0) {
          this.player.play('walk', true);
        } else {
          this.player.play('idle', true);
        }
      }
    }
  }
}

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  scene: SimpleGame,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
};

var game = new Phaser.Game(config);
