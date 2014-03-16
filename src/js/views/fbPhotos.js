define(['jquery', 'backbone', 'templates/jst', 'models/user', 'models/albumCover', 'tools/random'],
    function($, Backbone, tmplts, User, AlbumCover, Random){
    var fbPhotosView = Backbone.View.extend({
        el: "#content",
        rendered: false,
        section: null,
        breadcrumb: null,
        photoContainer: null,
        albumHTML: '',
        albums: [],
        events: {
            'click #fbpSelectLink': 'onPhotoSelectClick',
            'click #fbpUploadLink': 'onUploadClick'
        },

        hideBreadcrumb: function() {
            this.breadcrumb.style.display = 'none';
        },

        loadPhotos: function() {
            var _this = this;
            FB.api('/me/albums', {
                fields: 'id, name, count, picture',
                limit: 100
            }, function(r) {
                _this.albums = r.data;
                _this.showAlbums();
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

                this.breadcrumb = document.getElementById('fbBreadcrumb');
                this.photoContainer = $(document.getElementById('photosContainer'));

                this.setBreadcrumbEvents();
                this.loadPhotos();
            } else {
                AlbumCover.uploadedPhoto = '';
                document.getElementById('fbpSelectLink').className = '';
                $('a.fbPic').removeClass('selected');
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
                    AlbumCover.uploadedFromFacebook = true;

                    var callback = function() {
                        appRouter.showPhotoEdit();
                    };
                    _this.unload(callback);
                }
            });
        },

        setBreadcrumbEvents: function() {
            var _this = this;
            $(this.breadcrumb).find('a').click(function(ev) {
                ev.preventDefault();
                _this.showAlbums();
            });
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('fbPhotos'));
            }
        },

        showAlbums: function() {
            this.photoContainer.html('<span>Loading ...</span>');
            this.hideBreadcrumb();

            var _this = this;
            if(this.albumHTML === '') {
                _.each(this.albums, function(album) {
                    _this.albumHTML += '<a class="fbAlbum" rel="'+ album.id +'"><img src="'+ album.picture.data.url +'" alt="'+ album.name +'"><span>'+ album.name +'</span></a>';
                });
            }

            if(this.albumHTML !== '') {
                this.photoContainer.html(this.albumHTML);
                $('a.fbAlbum').click(function() {
                    _this.showAlbumPhotos($(this).attr('rel'), $(this).find('span').html());
                });
            }
        },

        showAlbumPhotos: function(albumId, albumName) {
            this.photoContainer.html('<span>Loading ...</span>');
            this.showBreadcrumb(albumName);

            var html = '',
                _this = this;
            FB.api('/'+ albumId +'/photos', {
                fields: 'picture, source, width',
                limit: 100
            }, function(r) {
                _.each(r.data, function(photo) {
                    html += '<a class="fbPic"><img src="'+ photo.picture +'" alt="'+ photo.source +'" fullwidth="'+ photo.width +'"></a>';
                });

                if(html !== '') {
                    _this.photoContainer.html(html);
                    $('a.fbPic').click(function() {
                        $('a.fbPic').removeClass('selected');
                        $(this).addClass('selected');
                        _this.onPhotoClick($(this).find('img'));
                    });
                }
            });
        },

        showBreadcrumb: function(albumName) {
            document.getElementById('fbCurrentAlbum').innerHTML = albumName;
            this.breadcrumb.style.display = 'block';
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