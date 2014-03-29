define([], function() {
    var User = function() {};
    User.prototype = {
        firstName: '',
        lastName: '',
        email: '',
        isAdmin: true
    };

    return new User();
});