SideScroller.MainMenu = function(){};

SideScroller.MainMenu.prototype = {
  create: function() {
  	//show the space tile, repeated
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'playerJump');

    //give it speed in x
    this.background.autoScroll(-20, 0);

    //start game text
    var text = "MY GAME";
    var style = { font: "30px Arial", fill: "#fa8072", align: "center" };

    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5);

    text = "Press Space to Begin";
    var h = this.game.add.text(this.game.width/2, this.game.height/2 + 50, text, style);
    h.anchor.set(0.5);

    this.space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },

  update: function() {
    if (this.space_key.isDown) {
      this.game.state.start('Game');
    }
  }
};
