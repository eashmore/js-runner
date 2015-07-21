var SideScroller = SideScroller || {};

SideScroller.Game = function () {};

SideScroller.Game.prototype = {

  preload: function () {
    this.game.time.advancedTiming = true;
    this.music = this.game.add.audio('music');

    this.jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.duck = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.punch = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    this.count = 0;
    this.gemCounter = this.count + '/47';
    this.style = { font: "30px Arial", fill: "#000", align: "center" };

    this.genFilter();
    this.addEmitter();

    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
    this.map.addTilesetImage('gemTiles', 'gemTiles');

    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.levelLayer = this.map.createLayer('levelLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.map.setCollisionBetween(1, 900, true, 'levelLayer');
    this.map.setCollisionBetween(1, 900, true, 'blockedLayer');

    this.objectLayer = this.findObjectsByType('coin', this.map, 'objectsLayer');

    this.coins = this.game.add.group();
    this.coins.enableBody = true;

    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;

    this.counter = this.game.add.text(this.game.width - 100, 50, this.gemCounter, this.style);
    this.counter.fixedToCamera = true;
    this.counter.anchor.set(0.5);

    this.gemIcon = this.game.add.sprite(this.game.width - 60, 32, 'gem');
    this.gemIcon.fixedToCamera = true;
  },

  create: function () {
    this.backgroundlayer.resizeWorld();

    this.addPlayer();

    this.createCoins();

    this.addEnemies();

    this.music.play();

    this.addInstructions();
  },

  update: function () {
    this.counter.setText(this.count + '/47');

    this.filter.update();
    this.game.camera.focusOnXY(this.player.x + 250, this.player.y);
    this.game.physics.arcade.overlap(this.player, this.blockedLayer, this.playerHit, null, this);

    this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.fightEnemy, null, this);

    this.game.physics.arcade.collide(this.player, this.levelLayer);

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
        this.playerWin();
      }
      if(this.player.y >= this.game.world.height) {
        this.playerDeath();
      }
    } else {
      if (this.jump.isDown) {
        this.music = this.game.add.audio('music');
        this.game.state.start('Game');
      }
    }

    this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);

    this.emitter.x = this.player.x;
    this.emitter.y = this.player.y + 100;
  },

  // render: function () {
    // this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
  // },

  addPlayer: function () {
    this.player = this.game.add.sprite(96, 350, 'player');
    this.player.animations.add('run', [0, 1, 2, 3, 4, 5], 10, true);
    this.player.animations.add('attack', [6, 7, 8, 9], 12, false);
    this.player.isAttacking = false;

    this.game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 2000;
    this.game.camera.focusOnXY(this.player.x + 250, this.player.y);

    var playerDuckImg = this.game.cache.getImage('playerDuck');
    this.player.duckedDimensions = {
      width: playerDuckImg.width - 50,
      height: 30
    };
    this.player.standDimensions = {
      width: this.player.width - 55,
      height: this.player.height - 15
    };
    this.player.anchor.setTo(0.5, 1);
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
    }.bind(this), 375);
  },

  playerHit: function (player, blockedLayer) {
    if (player.body.blocked.right || player.body.blocked.up) {
      this.playerDeath();
    }
  },

  playerDeath: function () {
    this.player.alive = false;
    this.player.loadTexture('playerDead');
    this.music.stop();

    var restartText = "YOU DIED!\nPress SPACE to Try Again";
    var style = { font: "30px Arial", fill: "#E60000", align: "center" };

    this.restart = this.game.add.text(this.game.width/2,
      this.game.height/2 - 100, restartText, style
    );
    this.restart.fixedToCamera = true;
    this.restart.anchor.set(0.5);
  },

  playerWin: function () {
    this.player.alive = false;

    var winText = "CONGRATULATIONS!\nPress SPACE to Play Again";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };

    this.win = this.game.add.text(this.game.width/2,
      this.game.height/2 - 100, winText, style
    );
    this.win.fixedToCamera = true;
    this.win.anchor.set(0.5);
  },

  addInstructions: function () {
    this.jumpControl = this.game.add.sprite(1150, 155, 'jumpControl');
    this.jumpControl.anchor.set(0.5);

    this.duckControl = this.game.add.sprite(650, 150, 'duckControl');
    this.duckControl.anchor.set(0.5);

    this.punchControl = this.game.add.sprite(5500, 275, 'punchControl');
    this.punchControl.anchor.set(0.5);

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
    collectable.destroy();
    this.count++;
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

    this.emitter.start(false, 2500, 700);
  },

  addEnemy: function (pos_x, pos_y) {
    var enemy = this.game.add.sprite(pos_x, pos_y, 'enemy');
    this.enemies.add(enemy);
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
      "uniform vec2     resolution;",

      "#define PI 3.1415926535897932384626433832795",

      "const float position = 0.0;",
      "const float scale = 1.0;",
      "const float intensity = 1.0;",

      // "varying vec2 surfacePosition;",
      // "vec2 pos;",

      "float band(vec2 pos, float amplitude, float frequency) {",
        "float wave = scale * amplitude * sin(1.0 * PI * frequency * pos.x + time) / 1.05;",
        // "float wave = scale * amplitude * sin(1.0 * PI * frequency * pos.x + time) / 0.50;",
        "float light = clamp(amplitude * frequency * 0.02, 0.001 + 0.001 / scale, 5.0) * scale / abs(wave - pos.y);",
        "return light;",
      "}",

      "void main() {",

        "vec3 color = vec3(1.5, 0.5, 1.2);",
        "color = color == vec3(0.0)? vec3(1.5, 0.5, 1.2) : color;",
        "vec2 pos = (gl_FragCoord.xy / resolution.xy);",
        "pos.y += - 0.5;",
        "float spectrum = 0.0;",
        "const float lim = 28.0;",
        "#define time time*0.037 + pos.x*10.",
        "for(float i = 0.0; i < lim; i++){",
            "spectrum += band(pos, 1.0*sin(time*0.1/PI), 1.0*sin(time*i/lim))/pow(lim, 0.25);",
        "}",

        "spectrum += band(pos, cos(10.7), 2.5);",
        "spectrum += band(pos, 0.4, sin(2.0));",
        "spectrum += band(pos, 0.05, 4.5);",
        "spectrum += band(pos, 0.1, 7.0);",
        "spectrum += band(pos, 0.1, 1.0);",

        "gl_FragColor = vec4(color * spectrum, spectrum);",

      "}"
    ];

    this.filter = new Phaser.Filter(this, null, fragmentSrc);
    this.filter.setResolution(746, 480);

    sprite = this.add.sprite();
    sprite.width = 768;
    sprite.height = 480;

    sprite.filters = [ this.filter ];

  },
};
