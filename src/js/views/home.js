define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var homeView = Backbone.View.extend({
        el: "#content",

        onFacebookClick: function() {
            
        },

        onGalleryClick: function() {
            appRouter.showGallery();
        },

        onUploadClick: function() {
            appRouter.showUploadForm();
        },

        render: function(){
            this.$el.html(JST['src/js/templates/home.html']());
            this.setEvents();
        },

        setEvents: function() {
            var _this = this;
            $(document.getElementById('fbLink')).click(function() {
                _this.onFacebookClick();
            });

            $(document.getElementById('galleryLink')).click(function() {
                _this.onGalleryClick();
            });

            $(document.getElementById('uploadLink')).click(function() {
                _this.onUploadClick();
            });
        }
    });
    
    return new homeView();
});