define(['jquery', 'backbone', 'templates/jst', 'models/user', 'models/albumCover', 'tools/random'],
    function($, Backbone, tmplts, User, AlbumCover, Random){
    var fbPhotosView = Backbone.View.extend({
        el: "#content",
        rendered: false,
        section: null,
        events: {
            'click #fbpSelectLink': 'onPhotoSelectClick',
            'click #fbpUploadLink': 'onUploadClick'
        },

        loadPhotos: function() {
            var _this = this;
            FB.api('/me/albums', {
                fields: 'id, photos, name'
            }, function(response) {
                var html = '';
                _.each(response.data, function(album) {
                    if(album.name === 'Profile Pictures') {
                        _.each(album.photos.data, function(photo) {
                            html += '<a class="fbPic"><img src="'+ photo.picture +'" alt="'+ photo.source +'" fullwidth="'+ photo.width +'"></a>';
                        });
                    }
                });

                if(html !== '') {
                    $(document.getElementById('photosContainer')).html(html);
                    $('a.fbPic').click(function() {
                        $('a.fbPic').removeClass('selected');
                        $(this).addClass('selected');
                        _this.onPhotoClick($(this).find('img'));
                    });
                }
            });
        },

        onPhotoClick: function(img) {
            AlbumCover.uploadedPhoto = img.attr('alt');
            document.getElementById('fbpSelectLink').className = 'active';
        },

        onPhotoSelectClick: function() {
            if(AlbumCover.uploadedPhoto === '') {
                return false;
            }

            this.save();
        },

        onUploadClick: function() {
            var callback = function() {
                appRouter.showUploadForm();
            };
            this.unload(callback);
        },

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/fbPhotos.html']());
                this.loadPhotos();
            } else {
                this.section.fadeIn();
            }
        },

        save: function() {
            var _this = this;
            $.post('/api/saveAccountInfo?r='+ Random.get(), {
                firstName: User.firstName,
                lastName: User.lastName,
                email: User.email,
                photo: AlbumCover.uploadedPhoto,
                fns: 'acct'
            }, function(rText) {
                var r = JSON.parse(rText);
                if(r.response && r.response.submission && r.response.submission === 'success') {
                    AlbumCover.uploadedPhoto = r.response.photo;
                    AlbumCover.uploadedPhotoWidth = r.response.width;

                    var callback = function() {
                        appRouter.showPhotoEdit();
                    };
                    _this.unload(callback);
                }
            });
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('fbPhotos'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new fbPhotosView();
});