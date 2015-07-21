var SideScroller = SideScroller || {};

SideScroller.Preload = function () {};

SideScroller.Preload.prototype = {

  preload: function () {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(this.preloadBar);

    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var loadingText = "Loading...";
    this.loadingText = this.game.add.text(this.game.world.centerX - 60,
      this.game.world.centerY - 60, loadingText, style
    );

    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/tiles_spritesheet.png');
    this.load.image('gemTiles', 'assets/images/gem.png');

    this.load.spritesheet('player', 'assets/images/roll.png', 73, 61);
    this.load.audio('music', 'assets/audio/like-a-dragon-short.mp3');
    this.load.audio('menuMusic', 'assets/audio/generic-techno-short.mp3');

    this.load.image('playerJump', 'assets/images/roll-jump.png');
    this.load.image('playerDuck', 'assets/images/roll-duck.png');
    this.load.image('playerDead', 'assets/images/roll-dead.png');

    this.load.image('enemy', 'assets/images/roll-enemy.png');

    this.load.image('gem', 'assets/images/gem.png');

    this.load.image('particle', 'assets/images/blue.png');

    this.load.image('controls', 'assets/images/runner-controls.png');
    this.load.image('jumpControl', 'assets/images/jump-instruct.png');
    this.load.image('duckControl', 'assets/images/duck-instruct.png');
    this.load.image('punchControl', 'assets/images/punch-instruct.png');

  },

  create: function () {
    this.state.start('MainMenu');
  }

};
