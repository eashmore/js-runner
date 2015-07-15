SideScroller.MainMenu = function(){};

SideScroller.MainMenu.prototype = {
  create: function() {
    this.music = this.game.add.audio('menuMusic');
    this.music.play();
    this.genFilter();
  	//show the space tile, repeated
    // this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'playerJump');
    this.controls = this.game.add.sprite(this.game.width - 370, this.game.height - 175, 'controls');

    //give it speed in x
    // this.background.autoScroll(-20, 0);

    //start game text
    var text = "Super Happy Running Time GO!!!";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };

    var t = this.game.add.text(this.game.width - 250, 165, text, style);
    t.anchor.set(0.5);

    text = "Press Space to Begin";
    style = { font: "20px Arial", fill: "#fff", align: "center" };
    var h = this.game.add.text(this.game.width - 200, 280, text, style);
    h.anchor.set(0.5);

    this.space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },

  update: function() {
    this.filter.update();
    if (this.space_key.isDown) {
      this.music.stop();
      this.game.state.start('Game');
    }
  },

  genFilter: function () {
    this.filter;
    var sprite;

    var fragmentSrc = [

        "precision mediump float;",

        "uniform vec2      resolution;",
        "uniform float     time;",

        "#define PI 90",

        "void main( void ) {",

        "vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;",

        "float sx = 0.3 * (p.x + 0.8) * sin( 900.0 * p.x - 1. * pow(time, 0.55)*5.);",

        "float dy = 4./ ( 500.0 * abs(p.y - sx));",

        "dy += 1./ (25. * length(p - vec2(p.x, 0.)));",

        "gl_FragColor = vec4( (p.x + 1.5) * dy, 0.3 * dy, dy, 1.1 );",

    "}"];

    this.filter = new Phaser.Filter(this.game, null, fragmentSrc);
    this.filter.setResolution(746, 480);

    sprite = this.game.add.sprite();
    sprite.width = 746;
    sprite.height = 480;

    sprite.filters = [ this.filter ];

  }
};
