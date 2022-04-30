import Phaser from "phaser";

class SimpleGame extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init() {
    this.player = null;
    this.pointer = this.input.activePointer;
    this.key = this.input.keyboard.createCursorKeys();
    this.star = null;
    this.bombs = null;
    this.score = 0;
    this.scoreText = null;
    this.canMove = true;
    this.heath = 3;
    this.heathBar = null;
  }

  preload() {
    this.load.image('sky', 'images/sky.png');
    this.load.image('road', 'images/road.png');
    this.load.image('bridge', 'images/bridge.png');
    this.load.image('star', 'images/star.png');
    this.load.image('bomb', 'images/bomb.png');
    this.load.atlas('player', 'images/joe.png', 'images/joe.json');
    this.load.atlas('caveman', 'images/caveman.png', 'images/caveman.json');
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    this.add.tileSprite(0, 600, 800, 226, 'road').setOrigin(0, 1);
    this.add.tileSprite(0, 450, 146, 53, 'bridge').setOrigin(0, 1);
    this.add.tileSprite(800, 350, 450, 53, 'bridge').setOrigin(1, 1);
    const road = this.physics.add.staticGroup();

    let object = this.add.rectangle(0, 600, 800, 15, 0x000000, 0).setOrigin(0, 1);
    let bridge1 = this.add.rectangle(0, 450, 146, 30, 0x000000, 0).setOrigin(0, 1);
    let bridge2 = this.add.rectangle(800, 350, 450, 30, 0x000000, 0).setOrigin(1, 1);
    road.add(object);
    road.add(bridge1);
    road.add(bridge2);

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player', {prefix: 'walk-', start: 1, end: 6}),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      'key': 'idle',
      'frames': this.anims.generateFrameNames('player', {prefix: 'idle-', start: 1, end: 2}),
      'frameRate': 2,
      'repeat': -1
    });

    this.anims.create({
      'key': 'jump',
      'frames': this.anims.generateFrameNames('player', {prefix: 'jump-', start: 1, end: 9}),
      'frameRate': 8,
      'repeat': -1
    });

    this.anims.create({
      'key': 'die',
      'frames': this.anims.generateFrameNames('player', {prefix: 'die-', start: 1, end: 4}),
      'frameRate': 2,
      'repeat': 0
    });

    this.anims.create({
      'key': 'caveman-walk',
      'frames': this.anims.generateFrameNames('caveman', {prefix: 'caveman-', start: 1, end: 4}),
      'frameRate': 4,
      'repeat': -1
    });

    this.anims.create({
      'key': 'girl-walk',
      'frames': this.anims.generateFrameNames('caveman', {prefix: 'girl-', start: 1, end: 3}),
      'frameRate': 8,
      'repeat': -1
    });

    this.anims.create({
      'key': 'girl-kiss',
      'frames': this.anims.generateFrameNames('caveman', {prefix: 'girl-', start: 4, end: 6}),
      'frameRate': 3,
      'repeat': 0
    });

    let caveman = this.add.sprite(0, 585, 'caveman', 'caveman-1')
      .setOrigin(0, 1)
      .play('caveman-walk')
      .on('animationupdate', () => {
        caveman.x += 5;
        if (caveman.x > 800) {
          caveman.stop();
          setTimeout(() => {
            caveman.x = 0;
            caveman.play('caveman-walk');
          }, 2000);
        }
      });

    this.player = this.physics.add.sprite(100, 450, 'player').setOrigin(0.5, 1).play('idle');
    this.player.body.syncBounds = true;
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, road);

    let hasKiss = false;
    let girl = this.physics.add.sprite(0, 580, 'caveman', 'girl-1')
      .setOrigin(0.5, 1)
      .setFlipX(true)
      .play('girl-walk')
      .on('animationupdate', () => {
        if (!hasKiss && this.heath > 0) {
          let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, girl.x, girl.y);
          if (distance < 10) {
            this.canMove = false;
            this.player.frame = this.textures.get('player').get('fun');
            this.player.setVelocityX(0)
              .setFlipX(!girl.flipX)
              .setX(girl.x + (girl.flipX ? 15 : -30))
              .setY(girl.y)
              .stop();

            girl.setVelocityX(0);
            girl.play('girl-kiss', true).on('animationcomplete', () => {
              this.canMove = true;
              if (this.heath < 3) {
                ++this.heath;
                this.heathBar.setText('Heath:' + this.heath);
              }
              hasKiss = true;
              girl.play('girl-walk').setVelocityX(girl.flipX ? 100 : -100);
            });
          }
        }

        if (girl.x > 750) {
          hasKiss = false;
          girl.setFlipX(false).setVelocityX(-100);
        }
        if (girl.x < 50) {
          hasKiss = false;
          girl.setFlipX(true).setVelocityX(100);
        }
      });

    this.physics.add.collider(girl, road);
    girl.body.syncBounds = true;

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
    this.heathBar = this.add.text(500, 16, 'Heath:' + this.heath, { fontSize: '32px', fill: '#000' });
  }

  /**
   * Nhặt được Sao
   * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} player
   * @param {*} star
   */
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
    if (this.heath > 0) {
      this.player.setFrame('die-1');
      --this.heath;
      this.heathBar.setText('Heath:' + this.heath);
    } else {
      if (this.player.state === 'die' ) {
        return;
      }

      this.player.play('die', true).setVelocityX(0);
      this.player.state = 'die';
      // player.setTint(0xff0000);
    }
  }

  update() {
    if (!this.canMove || this.player.state === 'die') {
      return;
    }

    if (this.key.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-330);
      this.player.play('jump', true);
    } else {
      if (this.key.left.isDown) {
        this.player.setFlipX(true).setVelocityX(-160);
      } else if (this.key.right.isDown) {
        this.player.setFlipX(false).setVelocityX(160);
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
