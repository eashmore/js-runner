var SideScroller = SideScroller || {};

SideScroller.Game = function () {};

SideScroller.Game.prototype = {

  preload: function () {
    this.game.time.advancedTiming = true;
    this.music = this.game.add.audio('music');
  },

  create: function () {
    this.genFilter();
    this.addEmitter();

    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
    this.map.addTilesetImage('gemTiles', 'gemTiles');

    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.map.setCollisionBetween(1, 1000, true, 'blockedLayer');

    this.backgroundlayer.resizeWorld();

    this.objectLayer = this.findObjectsByType('coin', this.map, 'objectsLayer');
    this.addPlayer();

    // this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jump = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.duck = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.punch = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    this.createCoins();

    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    this.addEnemies();

    this.music.play();
  },

  update: function () {
    this.filter.update();
    this.game.camera.focusOnXY(this.player.x + 250, this.player.y);
    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);
    this.game.physics.arcade.collide(this.player, this.blockedLayer);

    this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.fightEnemy, null, this);

    if (!this.player.isAttacking) {
      this.player.animations.play('run');
    }
    if(this.player.alive) {
      this.player.body.velocity.x = 400;
      if(this.jump.isDown) {
        this.playerJump();
        this.player.isAttacking = false;
      }

      else if(this.punch.isDown && !this.player.isAttacking) {
        this.player.loadTexture('player');
        this.playerAttack();
      }

      else if(this.duck.isDown && !this.player.isAttacking) {
        this.playerDuck();
        this.player.isAttacking = false;
      }

      if(this.player.isJumping && this.player.body.velocity.y === 0) {
        this.player.loadTexture('player');
        this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
        this.player.isJumping = false;
      }
      if(!this.duck.isDown && this.player.isDucked) {
        this.player.loadTexture('player');
        this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
        this.player.isDucked = false;
      }
      if(this.player.x >= this.game.world.width) {
        // this.game.state.start('Game');
        this.playerDeath();
      }
      if(this.player.y >= this.game.world.height) {
        this.playerDeath();
      }
    }

    this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);

    this.emitter.x = this.player.x;
    this.emitter.y = this.player.y + 100;
  },

  addPlayer: function () {
    this.player = this.game.add.sprite(96, 350, 'player');
    this.player.animations.add('run', [0, 1, 2, 3, 4, 5], 10, true);
    this.player.animations.add('attack', [6, 7, 8, 9], 15, false);
    this.player.isAttacking = false;

    this.game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 2000;
    this.game.camera.focusOnXY(this.player.x + 250, this.player.y);

    var playerDuckImg = this.game.cache.getImage('playerDuck');
    this.player.duckedDimensions = {
      width: playerDuckImg.width,
      height: 31
    };
    this.player.standDimensions = {
      width: this.player.width,
      height: this.player.height
    };
    this.player.anchor.setTo(0.5, 1);
  },

  render: function () {
    this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
  },

  playerJump: function () {
    this.player.loadTexture('playerJump');

    if (this.player.body.blocked.down) {
      this.player.body.velocity.y -= 550;
    }

    this.player.isJumping = true;
  },

  playerDuck: function () {
    this.player.loadTexture('playerDuck');
    this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height);
    this.player.isDucked = true;
  },

  playerAttack: function () {
    this.player.animations.play('attack');
    this.player.isAttacking = true;
    setTimeout(function () {
      this.player.isAttacking = false;
    }.bind(this), 325);
  },

  playerHit: function (player, blockedLayer) {
    if (player.body.blocked.right) {
      this.playerDeath();
    }
  },

  playerDeath: function () {
    this.player.alive = false;
    this.player.loadTexture('playerDead');
    // this.coins.forEach(function (coin) {
    //   coin.kill();
    // });
    //
    // this.createCoins();
    // this.enemies.forEach(function (enemy) {
    //   enemy.kill();
    // });
    // this.addEnemies();
    // this.music.stop();
    setTimeout(
      function () {
        this.game.state.start('Game');
    //     this.player.kill();
    //     this.music = this.game.add.audio('music');
    //
    //     this.addPlayer();
    //
    //     this.music.play();
      }.bind(this), 1000);

    // this.game.camera.focusOnXY(this.player.x + 250, this.player.y);

  },

  findObjectsByType: function (type, map, layerName) {
    var result = [];
      map.objects[layerName].forEach(function(element){
        if(element.properties.type === type) {
          element.y -= map.tileHeight;
          result.push(element);
        }
      });
    return result;
  },

  createFromTiledObject: function (element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
    Object.keys(element.properties).forEach(function(key){
      sprite[key] = element.properties[key];
    });
  },

  createCoins: function () {
    this.objectLayer.forEach(function(element){
      this.createFromTiledObject(element, this.coins);
    }, this);
  },

  collect: function (player, collectable) {
    // this.coinSound.play();
    collectable.destroy();
  },


  addEmitter: function () {
    this.emitter = this.add.emitter(this.world.centerX, 0, 0);
    this.emitter.makeParticles('particle');

    this.emitter.setRotation(0, 0);
    this.emitter.setAlpha(0.3, 0.5);
    this.emitter.setScale(0.5, 1);
    this.emitter.minParticleSpeed.set(300, 0);
    this.emitter.maxParticleSpeed.set(800, 0);
    this.emitter.gravity = -200;

    //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
    //	The 5000 value is the lifespan of each particle before it's killed
    this.emitter.start(false, 5000, 800);
  },

  addEnemy: function (pos_x, pos_y) {
    var enemy = this.game.add.sprite(pos_x, pos_y, 'enemy');

    this.enemies.add(enemy);

    // this.game.physics.arcade.overlap(this.player, enemy, this.fightEnemy(enemy), null, this);

  },

  addEnemies: function () {
    this.addEnemy(5552, 384);
    this.addEnemy(6240, 352);
    this.addEnemy(7520, 288);
    this.addEnemy(7648, 288);
    this.addEnemy(9664, 192);
    this.addEnemy(11680, 254);
    this.addEnemy(13184, 254);
    this.addEnemy(17056, 192);
    this.addEnemy(18902, 286);
    this.addEnemy(21120, 222);
    this.addEnemy(21280, 222);
    this.addEnemy(21420, 222);
    this.addEnemy(22688, 160);
    this.addEnemy(24160, 254);
    this.addEnemy(25024, 254);
  },

  fightEnemy: function (player, enemy) {
    if (player.isAttacking) {
      enemy.kill();
    } else {
      enemy.kill();
      this.player.body.velocity.x = 0;
      this.playerDeath();
    }
  },

  genFilter: function () {
    var sprite;
    var fragmentSrc = [
        "precision mediump float;",

        "uniform float     time;",
        "uniform vec2      resolution;",
        "uniform vec2      mouse;",

        "float rand(int seed, float ray) {",
            "return mod(sin(float(seed)*1.0+ray*1.0)*1.0, 1.0);",
        "}",

        "void main( void ) {",
            "float pi = 3.14159265359;",
            "vec2 position = ( gl_FragCoord.xy / resolution.xy ) - mouse;",
            "position.y *= resolution.y/resolution.x;",
            "float ang = atan(position.y, position.x);",
            "float dist = length(position);",
            "gl_FragColor.rgb = vec3(5.0, 0.5, 5.0) * (pow(dist, -1.0) * 0.05);",
            "for (float ray = 0.0; ray < 18.0; ray += 1.0) {",
                "//float rayang = rand(5234, ray)*6.2+time*5.0*(rand(2534, ray)-rand(3545, ray));",
                "//float rayang = time + ray * (1.0 * (1.0 - (1.0 / 1.0)));",
                "float rayang = (((ray) / 9.0) * 3.14) + (time * 0.5);",
                "rayang = mod(rayang, pi*2.0);",
                "if (rayang < ang - pi) {rayang += pi*2.0;}",
                "if (rayang > ang + pi) {rayang -= pi*2.0;}",
                "float brite = 0.3 - abs(ang - rayang);",
                "brite -= dist * 0.2;",
                "if (brite > 0.0) {",
                    "gl_FragColor.rgb += vec3(sin(ray*mouse.y+0.0)+1.0, sin(ray*mouse.y+2.0)+1.0, sin(ray*mouse.y+4.0)+1.0) * brite;",
                "}",
            "}",
            "gl_FragColor.a = 1.0;",
        "}"
    ];

    this.filter = new Phaser.Filter(this, null, fragmentSrc);
    this.filter.setResolution(800, 600);

    sprite = this.add.sprite();
    sprite.width = 800;
    sprite.height = 600;

    sprite.filters = [ this.filter ];

  },
};
