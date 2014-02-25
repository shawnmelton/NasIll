define(['jquery', 'backbone', 'templates/jst', 'models/user', 'models/albumCover', 'tools/random'],
    function($, Backbone, tmplts, User, AlbumCover, Random){
    var uploadFormView = Backbone.View.extend({
        el: "#content",
        errorMsg: null,
        section: null,
        rendered: false,

        events: {
            'click #upContinueLink': 'onContinueClick'
        },

        /**
         * Advance the user to the view to edit their uploaded photo.
         */
        goToPhotoEdit: function() {
            var callback = function() {
                appRouter.showPhotoEdit();
            };
            this.unload(callback);
        },

        onContinueClick: function(ev) {
            ev.preventDefault();
            this.validateUpload();
        },

        render: function(){
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/uploadForm.html']());
            } else {
                this.section.fadeIn();
            }
        },

        setErrorEl: function() {
            if(this.errorMsg === null) {
                this.errorMsg = $(document.getElementById('upErrorMsg'));
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('upload'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        },

        validateUpload: function() {
            if($('iframe').contents().find('#uploadedimage').length) {
                this.setErrorEl();
                this.errorMsg.fadeOut();
                this.goToPhotoEdit();
            } else {
                this.setErrorEl();
                this.errorMsg.fadeIn();
            }
        }
    });
    
    return new uploadFormView();
});