var SideScroller = SideScroller || {};

SideScroller.Preload = function(){};

SideScroller.Preload.prototype = {

  preload: function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(this.preloadBar);

    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/tiles_spritesheet.png');
    // this.load.image('gameTiles', 'assets/images/tiles-black.png');


    // this.load.image('player', 'assets/images/player.png');

    this.load.spritesheet('player', 'assets/images/roll.png', 73, 61);

    // this.load.spritesheet('playerAttack', 'assets/images/roll-punch.png', 80, 74);

    this.load.image('playerJump', 'assets/images/roll-jump.png');
    this.load.image('playerDuck', 'assets/images/roll-duck.png');
    this.load.image('playerDead', 'assets/images/roll-dead.png');

    this.load.image('enemy', 'assets/images/roll-enemy.png');

    this.load.image('goldCoin', 'assets/images/goldCoin.png');
    this.load.audio('coin', 'assets/audio/coin.wav');

    this.load.image('particle', 'assets/images/blue.png');

  },

  create: function() {
    this.state.start('Game');
  }

};
