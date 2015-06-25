(function () {
  if (window.Runner === undefined) {
    window.Runner = {};
  }

  var StationaryObject = Runner.StationaryObject = function (pos, game, radius, color) {
    this.game = game;
    this.pos = pos;
    this.radius = radius;
    this.color = color;
  };

  StationaryObject.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
  };

  StationaryObject.prototype.isCollidedWith = function(otherObject) {
    var x = Math.pow((this.pos[0] - otherObject.pos[0]), 2);
    var y = Math.pow((this.pos[1] - otherObject.pos[1]), 2);

    if (Math.sqrt(x+y) <= this.radius || Math.sqrt(x+y) <= otherObject.radius) {
      return true;
    }
    return false;
  };

  StationaryObject.prototype.collidedWith = function(otherObject) {
    if (this.isCollidedWith(otherObject) && otherObject === this.game.runner) {
      this.game.remove(this);
    }
  };
})();
