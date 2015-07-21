SideScroller.MainMenu = function(){};

SideScroller.MainMenu.prototype = {
  create: function() {
    this.music = this.game.add.audio('menuMusic');
    this.music.loop = true;
    this.music.play();
    this.genFilter();
    this.controls = this.game.add.sprite(this.game.width - 370, this.game.height - 175, 'controls');

    var text = "Super Lazer Girl GO!!!";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };

    var title = this.game.add.text(this.game.width - 200, 160, text, style);
    title.anchor.set(0.5);

    text = "Press Space to Begin";
    style = { font: "20px Arial", fill: "#fff", align: "center" };
    var begin = this.game.add.text(this.game.width - 200, 210, text, style);
    begin.anchor.set(0.5);

    text = "For the best experiece, play with sound!";
    style = { font: "16px Arial", fill: "#fff", align: "center" };
    var disclaimer = this.game.add.text(this.game.width - 200, 280, text, style);
    disclaimer.anchor.set(0.5);

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
