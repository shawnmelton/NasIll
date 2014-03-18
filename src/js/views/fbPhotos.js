define(['jquery', 'backbone', 'templates/jst', 'models/user', 'models/albumCover', 'tools/random'],
    function($, Backbone, tmplts, User, AlbumCover, Random){
    var fbPhotosView = Backbone.View.extend({
        el: "#content",
        rendered: false,
        section: null,
        breadcrumb: null,
        photoContainer: null,
        previousLink: null,
        nextLink: null,
        currentAlbumId: null,
        currentAlbumName: null,
        albums: [],
        albumStart: 0,
        albumLimit: 6,
        photoStart: 0,
        photoLimit: 8,
        photosLength: 0,
        viewingAlbums: true,
        events: {
            'click #fbpSelectLink': 'onPhotoSelectClick',
            'click #fbpUploadLink': 'onUploadClick',
            'click #fbpPrev': 'onPreviousClick',
            'click #fbpNext': 'onNextClick'
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

        onNextClick: function(ev) {
            ev.preventDefault();

            if(this.nextLink.className !== 'inactive') {
                this.previousLink.className = '';

                if(this.viewingAlbums) {
                    this.albumStart += this.albumLimit;
                    this.showAlbums();

                    if((this.albumStart + this.albumLimit) >= this.albums.length) {
                        this.nextLink.className = 'inactive';
                    }
                } else {
                    this.photoStart += this.photoLimit;
                    this.showAlbumPhotos();

                    if((this.photoStart + this.photoLimit) >= this.photosLength) {
                        this.nextLink.className = 'inactive';
                    }
                }
            }
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

        onPreviousClick: function(ev) {
            ev.preventDefault();

            if(this.previousLink.className !== 'inactive') {
                this.nextLink.className = '';

                if(this.viewingAlbums) {
                    this.albumStart -= this.albumLimit;
                    this.showAlbums();

                    if(this.albumStart <= 0) {
                        this.previousLink.className = 'inactive';
                    }
                } else {
                    this.photoStart -= this.photoLimit;
                    this.showAlbumPhotos();

                    if(this.photoStart <= 0) {
                        this.previousLink.className = 'inactive';
                    }
                }
            }
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
                this.nextLink = document.getElementById('fbpNext');
                this.previousLink = document.getElementById('fbpPrev');
                this.previousLink.className = 'inactive';

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
            this.viewingAlbums = true;

            this.previousLink.className = (this.albumStart <= 0) ? 'inactive' : '';
            this.nextLink.className = ((this.albumStart + this.albumLimit) >= this.albums.length) ? 'inactive' : '';

            var _this = this,
                albumHTML = '';
            _.each(this.albums, function(album, index) {
                if(index >= _this.albumStart && index < (_this.albumStart + _this.albumLimit)) {
                    albumHTML += '<a class="fbAlbum" rel="'+ album.id +'"><img src="'+ album.picture.data.url +'" alt="'+ album.name +'"><span>'+ album.name +'</span></a>';
                }
            });

            if(albumHTML !== '') {
                this.photoContainer.html(albumHTML);
                $('a.fbAlbum').click(function() {
                    _this.currentAlbumName = $(this).find('span').html();
                    _this.currentAlbumId = $(this).attr('rel');
                    _this.photoStart = 0;
                    _this.showAlbumPhotos();
                });
            }
        },

        showAlbumPhotos: function() {
            this.photoContainer.html('<span>Loading ...</span>');
            this.showBreadcrumb(this.currentAlbumName);
            this.viewingAlbums = false;

            if(this.photoStart === 0) {
                this.nextLink.className = '';
                this.previousLink.className = 'inactive';
            }

            var html = '',
                _this = this;
            FB.api('/'+ this.currentAlbumId +'/photos', {
                fields: 'picture, source, width',
                limit: 100
            }, function(r) {
                _this.photosLength = r.data.length;
                _.each(r.data, function(photo, index) {
                    if(index >= _this.photoStart && index < (_this.photoStart + _this.photoLimit)) {
                        html += '<a class="fbPic"><img src="'+ photo.picture +'" alt="'+ photo.source +'" fullwidth="'+ photo.width +'"></a>';
                    }
                });

                if(_this.photosLength <= _this.photoLimit) {
                    _this.nextLink.className = 'inactive';
                }

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