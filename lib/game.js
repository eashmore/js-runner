var SideScroller = SideScroller || {};

SideScroller.Game = function(){};

SideScroller.Game.prototype = {

  preload: function() {
      this.game.time.advancedTiming = true;
  },

  create: function() {
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
    this.backgroundlayer.resizeWorld();

    this.player = this.game.add.sprite(100, 200, 'player');
    this.game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 1000;
    this.game.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    var playerDuckImg = this.game.cache.getImage('playerDuck');
    this.player.duckedDimensions = {width: playerDuckImg.width, height: playerDuckImg.height};
    this.player.standDimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);
  },

  update: function() {
    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);

    if(this.player.alive) {
      this.player.body.velocity.x = 300;
      if(this.cursors.up.isDown) {
        this.playerJump();
      }
      else if(this.cursors.down.isDown) {
        this.playerDuck();
      }
      if(!this.cursors.down.isDown && this.player.isDucked) {
        this.player.loadTexture('player');
        this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
        this.player.isDucked = false;
      }
      if(this.player.x >= this.game.world.width) {
        this.game.state.start('Game');
      }
    }
  },

  render: function() {
    this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
  },

  playerJump: function() {
    if (this.player.body.blocked.down) {
      this.player.body.velocity.y -= 300;
    }
  },

  playerDuck: function() {
    this.player.loadTexture('playerDuck');
    this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height);
    this.player.isDucked = true;
  },

  playerHit: function(player, blockedLayer) {
    if (player.body.blocked.right) {
      this.player.alive = false;
      this.player.body.velocity.x = 0;
      this.player.loadTexture('playerDead');
      this.game.time.events.add(1500, this.gameOver, this);
    }
  },
};
