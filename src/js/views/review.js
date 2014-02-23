define(['jquery', 'backbone', 'templates/jst', 'models/albumCover'], function($, Backbone, tmplts, AlbumCover){
    var reviewView = Backbone.View.extend({
        el: "#content",
        section: null,
        rendered: false,

        events: {
            'click #rContinueLink': 'onContinueClick',
            'click #rBackLink': 'onBackClick',
        },

        onBackClick: function() {
            var callback = function() {
                appRouter.showPhotoEdit();
            };
            this.unload(callback);
        },

        onContinueClick: function() {
            var callback = function() {
                appRouter.showShare();
            };
            this.unload(callback);
        },

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/review.html']({
                    photoUrl: AlbumCover.artPhoto
                }));
            } else {
                document.getElementById('rUploadedPhoto').src = AlbumCover.artPhoto;
                this.section.fadeIn();
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('review'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new reviewView();
});