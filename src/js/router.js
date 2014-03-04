define(['jquery', 'backbone', 'views/home', 'libs/json2'], function($, Backbone, homeView, jsn2) {

    var AppRouter = Backbone.Router.extend({
        initialize: function() {
            this.route(/^.*$/, 'showHome');
        },

        /**
         * Clean up the current page when its requested.
         */
        pageLoad: function() {
            window.scrollTo(0,0);
        },

        showConfirmPhoto: function() {
            this.pageLoad();
            require(['views/confirmPhoto'], function(confirmPhotoView) {
                confirmPhotoView.render();
            });
        },

        showEmailForm: function() {
            this.pageLoad();
            require(['views/emailForm'], function(emailFormView) {
                emailFormView.render();
            });
        },

        showFacebookPhotos: function() {
            this.pageLoad();
            require(['views/fbPhotos'], function(fbPhotosView) {
                fbPhotosView.render();
            });
        },

        showGallery: function() {
            this.pageLoad();
            require(['views/gallery'], function(galleryView) {
                galleryView.render();
            });
        },

        showHome: function() {
            homeView.render();

            if(document.getElementsByTagName('html')[0].className === '') {
                this.showMusic();
            }
        },

        showMusic: function() {
            require(['views/music'], function(musicViewEl) {
                musicViewEl.render();
            });
        },

        showPhotoEdit: function() {
            this.pageLoad();
            require(['views/photoEdit'], function(photoEditView) {
                photoEditView.render();
            });
        },

        showReview: function() {
            this.pageLoad();
            require(['views/review'], function(reviewView) {
                reviewView.render();
            });
        },

        showShare: function() {
            this.pageLoad();
            require(['views/share'], function(shareView) {
                shareView.render();
            });
        },

        showThankYouMbl: function() {
            this.pageLoad();
            require(['views/thankYouMobile'], function(thankYouMblView) {
                thankYouMblView.render();
            });
        },

        showUploadForm: function() {
            this.pageLoad();
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