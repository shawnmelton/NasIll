define(['libs/domReady', 'router'], function(domReady, Router){
    domReady(function() {
        window.devMode = true;
        Router.initialize();
    });
});