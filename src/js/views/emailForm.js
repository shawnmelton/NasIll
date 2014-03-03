define(['jquery', 'backbone', 'templates/jst', 'models/user', 'tools/random'],
    function($, Backbone, tmplts, User, Random){
    var emailFormView = Backbone.View.extend({
        el: "#content",
        form: null,
        errorMsg: null,
        section: null,
        rendered: false,

        events: {
            'click #emContinueLink': 'onContinueClick',
            'click #emMblBackLink': 'onCancelClick',
            'submit #emailForm': 'onContinueClick'
        },

        /**
         * Advance the user to the view to edit their uploaded photo.
         */
        goToPhotoEdit: function() {
            var callback = function() {
                if($(document).width() < 800) { // Mobile version of site.
                    appRouter.showThankYouMbl();
                } else {
                    appRouter.showUploadForm();
                }
            };
            this.unload(callback);
        },

        onCancelClick: function(ev) {
            ev.preventDefault();
            var callback = function() {
                appRouter.showHome();
            };
            this.unload(callback);
        },

        onContinueClick: function(ev) {
            ev.preventDefault();
            this.setFormEl();

            var _this = this;
            $.post('/api/saveAccountInfo?r='+ Random.get(), this.form.serialize(), function(rText) {
                var r = JSON.parse(rText);
                if(r.response && r.response.submission) {
                    if(r.response.submission === 'success') {
                        User.firstName = $(document.getElementById('firstName')).val();
                        User.lastName = $(document.getElementById('lastName')).val();
                        User.email = $(document.getElementById('email')).val();

                        _this.goToPhotoEdit();
                        _this.setErrorEl();
                        _this.errorMsg.fadeOut();
                    } else {
                        _this.setErrorEl();
                        _this.errorMsg.fadeIn();
                    }
                }
            });
        },

        /**
         * Load user information, if applicable.
         */
        populateForm: function() {
            if(User.firstName !== '') {
                document.getElementById('firstName').value = User.firstName;
                document.getElementById('firstNameWrapper').style.display = 'none';
            }

            if(User.lastName !== '') {
                document.getElementById('lastName').value = User.lastName;
                document.getElementById('lastNameWrapper').style.display = 'none';
            }

            if(User.email !== '') {
                document.getElementById('email').value = User.email;
                document.getElementById('emailWrapper').style.display = 'none';
            }
        },

        render: function(){
            document.getElementsByTagName('body')[0].className = 'overlay';

            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/emailForm.html']());
                this.populateForm();
            } else {
                this.section.fadeIn();
            }
        },

        setErrorEl: function() {
            if(this.errorMsg === null) {
                this.errorMsg = $(document.getElementById('emErrorMsg'));
            }
        },

        setFormEl: function() {
            if(this.form === null) {
                this.form = $(document.getElementById('emailForm'));
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('eml'));
            }
        },

        unload: function(callback) {
            document.getElementsByTagName('body')[0].className = '';
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new emailFormView();
});