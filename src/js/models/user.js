define([], function() {
    var User = function() {};
    User.prototype = {
        firstName: '',
        lastName: '',
        email: '',
        isAdmin: false
    };

    return new User();
});