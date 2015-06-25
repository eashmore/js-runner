(function () {
  if (window.Runner === undefined) {
    window.Runner = {};
  }
  var Util = Runner.Util = function() {};

  Util.inherits = function (ChildClass, ParentClass) {
    function Surrogate() {}
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
  };
})();
