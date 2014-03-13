define(['jquery', 'backbone', 'templates/jst', 'models/albumCover'], function($, Backbone, tmplts, AlbumCover){
    var confirmPhotoView = Backbone.View.extend({
        el: "#content",
        section: null,
        rendered: false,

        events: {
            'click #cpContinueLink': 'onContinueClick',
            'click #cpUploadLink': 'onUploadClick',
        },

        onContinueClick: function() {
            var callback = function() {
                appRouter.showPhotoEdit();
            };
            this.unload(callback);
        },

        onUploadClick: function() {
            var callback = function() {
                appRouter.showUploadForm();
            };
            this.unload(callback);
        },

        render: function() {
            if(!this.rendered) {
                this.$el.append(JST['src/js/templates/confirmPhoto.html']({
                    photoUrl: AlbumCover.uploadedPhoto,
                    photoName: AlbumCover.fileName
                }));

                this.rendered = true;
            } else {
                document.getElementById('cpPhoto').src = AlbumCover.uploadedPhoto;
                document.getElementById('cpPhotoName').innerHTML = AlbumCover.fileName;

                this.section.fadeIn();
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('confirmPhoto'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new confirmPhotoView();
});