define(['jquery'], function($) {
    var Device = function() {};
    Device.prototype = {
        isMobile: function() {
            return ($(document).width() < 800);
        }
    };

    return new Device();
});