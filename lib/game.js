(function () {
  if (window.Runner === undefined) {
    window.Runner = {};
  }

  var Game = Runner.Game = function() {
    this.DIM_X = 1024;
    this.DIM_Y = 576;

    this.offsetX = 0;
    this.offsetY = 0;

    this.playerX = 20;
    this.playerY = 20;

    this.obstacles = [];
    this.addObstacles();
  };

  Game.prototype.addObstacles = function() {
    var i = 0;
    this.obstacles.push(new Runner.block([1000,100], this));
    i++;
  };

  Game.prototype.draw = function(ctx) {
    ctx.translate(this.offsetX, this.offsetY);
    ctx.clearRect(-this.offsetX, -this.offsetY, this.DIM_X, this.DIM_Y);
    this.allObjects().forEach(function(object) {
      object.draw(ctx);
    });
  };

  Game.prototype.checkCollisions = function() {
    for(var i = 0; i < this.allObjects().length; i++) {
      for(var j = i+1; j < this.allObjects().length; j++) {
        this.allObjects()[i].collidedWith(this.allObjects()[j]);
      }
    }
  };

  Game.prototype.step = function() {
    this.moveScreen();
    this.checkCollisions();
  };

  // Game.prototype.remove = function(asteroid) {
  //   var removeIndex = this.asteroids.indexOf(asteroid);
  //   this.asteroids.splice(removeIndex, 1);
  // };

  Game.prototype.allObjects = function() {
    var all = this.obstacles; //.concat([this.runner]);
    return all;
  };

  // Game.prototype.moveObjects = function() {
  //   this.allObjects().forEach(function(obstacles) {
  //     obstacles.move();
  //   });
  // };

  Game.prototype.moveScreen = function() {
    this.offsetX -= 0.01;
    // this.offsetY += 1;
  };
})();
