define(['jquery', 'backbone', 'templates/jst', 'models/albumCover'], function($, Backbone, tmplts, AlbumCover){
    var shareView = Backbone.View.extend({
        el: "#content",
        section: null,
        rendered: false,

        events: {
            'click #sGalleryLink': 'onGalleryClick'
        },

        onGalleryClick: function() {
            var callback = function() {
                appRouter.showGallery();
            };
            this.unload(callback);
        },

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/share.html']({
                    photoUrl: AlbumCover.artPhoto,
                    shareMsg: encodeURIComponent("Check out my personal 20th Anniversary Nas illmatic album cover!"),
                    shareUrl: encodeURIComponent(location.href)
                }));
            } else {
                document.getElementById('sAlbumArt').src = AlbumCover.artPhoto;
                this.section.fadeIn();
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('share'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new shareView();
});