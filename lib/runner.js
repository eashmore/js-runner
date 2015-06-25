(function () {
  if (window.Runner === undefined) {
    window.Runner = {};
  }

  var runner = Runner.runner = function (game, pos) {
    this.game = game;
    this.pos = pos;
    this.color = 'red';
    this.radius = 10;
  };

  Runner.Util.inherits(Runner.runner, Runner.MovingObject);

})();
