define(['jquery', 'backbone', 'templates/jst', 'models/albumCover'], function($, Backbone, tmplts, AlbumCover){
    var photoEditView = Backbone.View.extend({
        el: "#content",
        errorMsg: null,
        form: null,
        section: null,
        rendered: false,

        events: {
            'click #peContinueLink': 'onContinueClick',
            'click #peBackLink': 'onBackClick',
            'submit #photoEditForm': 'onContinueClick'
        },

        goToReview: function() {
            var callback = function() {
                appRouter.showReview();
            };
            this.unload(callback);
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

        onContinueClick: function(ev) {
            ev.preventDefault();
            this.setFormEl();

            var _this = this;
            $.post('/api/generateAlbumArt', this.form.serialize(), function(rText) {
                var r = JSON.parse(rText);
                if(r.response && r.response.submission) {
                    if(r.response.submission === 'success') {
                        AlbumCover.artPhoto = r.response.album;
                        _this.goToReview();
                    } else {
                        _this.setErrorEl();
                        _this.errorMsg.fadeIn();
                    }
                }
            });
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

        setErrorEl: function() {
            if(this.errorMsg === null) {
                this.errorMsg = $(document.getElementById('peErrorMsg'));
            }
        },

        setFormEl: function() {
            if(this.form === null) {
                this.form = $(document.getElementById('photoEditForm'));
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