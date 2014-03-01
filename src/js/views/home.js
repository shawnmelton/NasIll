define(['jquery', 'backbone', 'templates/jst', 'models/user'], function($, Backbone, tmplts, User){
    var homeView = Backbone.View.extend({
        el: "#content",
        rendered: false,
        section: null,

        events: {
            'click #hFbLink': 'onFacebookClick',
            'click #hGalleryLink': 'onGalleryClick',
            'click #hUploadLink': 'onUploadClick'
        },

        goToPhotoGallery: function() {
            var callback = function() {
                appRouter.showFacebookPhotos();
            };
            this.unload(callback);
        },

        onFacebookClick: function() {
            var _this = this;
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    /*var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;*/
                    _this.onFacebookLogin();
                } else {
                    FB.login(function() {
                        _this.onFacebookLogin();
                    }, { scope: 'email, user_photos' });
                }
            });
        },

        /**
         * User has properly authenticated.
         */
        onFacebookLogin: function() {
            var _this = this;
            FB.api('/me', function(response) {
                User.firstName = response.first_name;
                User.lastName = response.last_name;
                User.email = response.email || '';

                // Allow the user to select photos from their profile.
                _this.goToPhotoGallery();
            });
        },

        onGalleryClick: function() {
            var callback = function() {
                appRouter.showGallery(true);
            };
            this.unload(callback);
        },

        onUploadClick: function() {
            var callback = function() {
                appRouter.showEmailForm();
            };
            this.unload(callback);
        },

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/home.html']());
            } else {
                this.section.fadeIn();
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('home'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new homeView();
});