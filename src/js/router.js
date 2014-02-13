define(['jquery', 'backbone', 'views/home'], 
    function($, Backbone, homeView) {

    var AppRouter = Backbone.Router.extend({
        initialize: function() {
            this.route(/^.*$/, 'showHome');
        },

        /**
         * Clean up the current page when its requested.
         */
        pageLoad: function(view) {
            window.scrollTo(0,0);
        },

        showHome: function() {
            homeView.render();
        },

        showUploadForm: function() {
            this.pageLoad('uploadForm');
            require(['views/uploadForm'], function(uploadFormView) {
                uploadFormView.render();
            });
        }
    });
    
    /**
     * Start the routing.  Make sure that we only use browser
     * push state if the browser supports it.
     */
    var initialize = function(){
        window.appRouter = new AppRouter();
        var usePushState = !!(window.history && window.history.pushState);
        Backbone.history.start({
            pushState: usePushState,
            hashChange: usePushState
        });
    };
    
    return {
        initialize: initialize
    };
});