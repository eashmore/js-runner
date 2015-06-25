(function () {
  if (window.Runner === undefined) {
    window.Runner = {};
  }

  var GameView = Runner.GameView = function(canvas) {
    this.game = new Runner.Game();
    Runner.ctx = canvas;
  };

  GameView.prototype.start = function() {
    var game = this.game;
    var that = this;
    setInterval(game.step.bind(game), 16);
    setInterval(game.draw.bind(game, Runner.ctx), 16);
    // setInterval(that.bindKeyHandlers.bind(that), 16);
  };
})();
