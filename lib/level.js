(function () {
  if (window.Runner === undefined) {
    window.Runner = {};
  }

  var level = Runner.level = function (pos, size) {
    this.pos = pos;

    this.width = size[0];
    this.height = size[1];
  };

  Runner.Util.inherits(Runner.level, Runner.StationaryObject);

  Runner.level.prototype.draw = function(ctx) {
    Runner.ctx.fillStyle = 'black';
    Runner.ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  };


})();
