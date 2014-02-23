define([], function() {
    var Random = function() {};
    Random.prototype = {
        get: function() {
            return Math.floor((Math.random() * 1000) + 1);
        }
    };

    return new Random();
});