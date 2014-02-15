define(['jquery', 'backbone', 'templates/jst', 'models/albumCover'], function($, Backbone, tmplts, AlbumCover){
    var photoEditView = Backbone.View.extend({
        el: "#content",
        section: null,
        rendered: false,

        events: {
            'click #peContinueLink': 'onContinueClick',
            'click #peBackLink': 'onBackClick',
        },

        onBackClick: function() {
            var callback;
            if(/* Logged in with FB */ false) {

            } else {
                callback = function() {
                    appRouter.showUploadForm();
                };
            }

            this.unload(callback);
        },

        onContinueClick: function() {
            var callback = function() {
                appRouter.showReview();
            };
            this.unload(callback);
        },

         render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/photoEdit.html']({
                    photoUrl: AlbumCover.uploadedPhoto
                }));
            } else {
                this.section.fadeIn();
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('photoEdit'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new photoEditView();
});