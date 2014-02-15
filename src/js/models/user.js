define([], function() {
    var User = function() {};
    User.prototype = {
        firstName: '',
        lastName: '',
        email: ''
    };

    return new User();
});