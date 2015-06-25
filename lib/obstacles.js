(function () {
  if (window.Runner === undefined) {
    window.Runner = {};
  }
  var block = Runner.block = function (pos, game) {
    Runner.MovingObject.call(this, pos, game);
    this.color = "#000000";
    this.radius = 10;
    this.vel = [0, 0];
  };
  Runner.Util.inherits(Runner.block, Runner.MovingObject);

  var hurdle = Runner.hurdle = function (pos, game) {
    Runner.MovingObject.call(this, pos, game);
    this.color = "#000000";
    this.radius = 10;
    this.vel = [5, 0];
  };
  Runner.Util.inherits(Runner.block, Runner.MovingObject);

  var enemy = Runner.enemy = function (pos, game) {
    Runner.MovingObject.call(this, pos, game);
    this.color = "#000000";
    this.radius = 10;
    this.vel = [5, 0];
  };
  Runner.Util.inherits(Runner.block, Runner.MovingObject);

})();
