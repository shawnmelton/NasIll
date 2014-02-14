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

        showFacebookPhotos: function() {
            this.pageLoad('fbPhotos');
            require(['views/fbPhotos'], function(fbPhotosView) {
                fbPhotosView.render();
            });
        },

        showGallery: function() {
            this.pageLoad('gallery');
            require(['views/gallery'], function(galleryView) {
                galleryView.render();
            });
        },

        showHome: function() {
            homeView.render();
        },

        showPhotoEdit: function() {
            this.pageLoad('photoEdit');
            require(['views/photoEdit'], function(photoEditView) {
                photoEditView.render();
            });
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