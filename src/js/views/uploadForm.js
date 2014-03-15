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
                appRouter.showConfirmPhoto();
            };
            this.unload(callback);
        },

        onContinueClick: function(ev) {
            ev.preventDefault();

            if($(document.getElementById('upContinueLink')).hasClass('active')) {
                this.validateUpload();
            }
        },

        render: function(){
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/uploadForm.html']());
            } else {
                $(document.getElementById('upContinueLink')).removeClass('active');
                document.getElementById('uploadFrame').src = '/api/upload';
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
            var _this = this;
            this.setErrorEl();

            $.getJSON('/api/getUploadedPhoto?r='+ Random.get(), function(r) {
                if(r.response && r.response.submission && r.response.submission === 'success') {
                    if(r.response.photo === null || r.response.photo === '') {
                        _this.errorMsg.fadeIn();
                    } else {
                        AlbumCover.uploadedPhoto = r.response.photo;
                        AlbumCover.fileName = r.response.fileName;
                        AlbumCover.uploadedPhotoWidth = r.response.width;
                        AlbumCover.uploadedFromFacebook = false;

                        _this.errorMsg.fadeOut();
                        _this.goToPhotoEdit();
                    }
                }
            });
        }
    });
    
    return new uploadFormView();
});