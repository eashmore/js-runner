(function () {
  if (window.Runner === undefined) {
    window.Runner = {};
  }
  var block = Runner.block = function (pos, game) {
    Runner.StationaryObject.call(this, pos, game);
    this.color = "#000000";
    this.radius = 10;
  };
  Runner.Util.inherits(Runner.block, Runner.StationaryObject);

  var hurdle = Runner.hurdle = function (pos, game) {
    Runner.StationaryObject.call(this, pos, game);
    this.color = "#000000";
    this.radius = 10;
  };
  Runner.Util.inherits(Runner.hurdle, Runner.StationaryObject);

  var enemy = Runner.enemy = function (pos, game) {
    Runner.StationaryObject.call(this, pos, game);
    this.color = "#000000";
    this.radius = 10;
  };
  Runner.Util.inherits(Runner.enemy, Runner.StationaryObject);

})();
