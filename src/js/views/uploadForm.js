define(['jquery', 'backbone', 'templates/jst', 'models/user', 'models/albumCover'],
    function($, Backbone, tmplts, User, AlbumCover){
    var uploadFormView = Backbone.View.extend({
        el: "#content",
        form: null,
        errorMsg: null,
        accountId: null,
        section: null,
        rendered: false,

        events: {
            'click #upContinueLink': 'onContinueClick',
            'click #upResetLink': 'onResetClick',
            'submit #uploadForm': 'onContinueClick'
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
            this.setFormEl();

            var _this = this;
            $.post('/api/saveAccountInfo', this.form.serialize(), function(rText) {
                var r = JSON.parse(rText);
                if(r.response && r.response.submission) {
                    if(r.response.submission === 'success') {
                        User.firstName = $(document.getElementById('firstName')).val();
                        User.lastName = $(document.getElementById('lastName')).val();
                        User.email = $(document.getElementById('email')).val();

                        AlbumCover.uploadedPhoto = r.response.photo;
                        _this.goToPhotoEdit();
                    } else {
                        _this.setErrorEl();
                        _this.errorMsg.fadeIn();
                    }
                }
            });
        },

        /**
         * Reset the form so that all the entered values are cleared out.
         */
        onResetClick: function() {
            document.getElementById('uploadFrame').src = '/ss/upload.php';
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            document.getElementById('email').value = '';
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
                this.errorMsg = $(document.getElementById('errorMsg'));
            }
        },

        setFormEl: function() {
            if(this.form === null) {
                this.form = $(document.getElementById('uploadForm'));
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
        }
    });
    
    return new uploadFormView();
});