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
                    fbShareMsg: encodeURIComponent("Nas changed the face of rap music back in '94 when he released Illmatic. Now it's your turn. Make your IllmaticXX cover at http://illmaticXX.nasirjones.com/ #IllmaticXX"),
                    twShareMsg: encodeURIComponent("Nas changed the face of rap music back in '94 when he released Illmatic. Now it's your turn. http://illmaticXX.nasirjones.com/ #IllmaticXX"),
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