define(['jquery', 'backbone', 'templates/jst', 'views/lightbox', 'tools/random', 'tools/device', 'models/user'],
    function($, Backbone, tmplts, lightBoxViewEl, Random, Device, User){
    var galleryView = Backbone.View.extend({
        el: "#content",
        artEl: null,
        section: null,
        rendered: false,
        rowStart: 0,
        rowLimit: Device.isMobile() ? 3 : 5,
        rowsPerPage: Device.isMobile() ? 3 : 2,
        reachedLimit: false,
        imageSet: [],
        
        events: {
            'click #gBackLink': 'onBackClick',
            'click #gPrev': 'onPreviousClick',
            'click #gNext': 'onNextClick'
        },

        addImagesToSet: function(imgs) {
            var _this = this;
            _.each(imgs, function(img) {
                _this.imageSet.push({
                    url: img.url,
                    id: img.id
                });
            });
        },

        loadImages: function() {
            var _this = this;
            var callback = function() {
                $('#gArt img').click(function() {
                    lightBoxViewEl.render($(this).attr('src'), $(this).attr('alt'), _this.imageSet);
                });
            };

            this.imageSet = [];
            this.artEl.empty();
            this.loadRows(callback);
        },

        loadRows: function(callback) {
            var _this = this;
            $.getJSON('/api/getGalleryArt', {
                start: this.rowStart,
                limit: (this.rowLimit * this.rowsPerPage),
                r: Random.get()
            }, function(r) {
                if(r.response.reachedLimit) {
                    _this.reachedLimit = true;
                    _this.nextBtnEl.className = 'gArrow inactive';
                }

                if(r.response.art.length > 0) {
                    for(var i = 0; i < _this.rowsPerPage; i++) {
                        var slice = r.response.art.slice((i * _this.rowLimit), (i * _this.rowLimit) + _this.rowLimit);
                        if(slice.length > 0) {
                            _this.artEl.append(JST['src/js/templates/galleryRow.html']({
                                images: slice,
                                baseIdx: (i * _this.rowLimit)
                            }));
                        }
                    }

                    _this.imageSet = r.response.art;
                } else {
                    _this.onPreviousClick(null);
                    _this.reachedLimit = true;
                    _this.nextBtnEl.className = 'gArrow inactive';
                }

                callback();
            });

            this.rowStart += (this.rowLimit * this.rowsPerPage);
        },

        loadUser: function() {
            $.getJSON('/api/getCurrentUser', function(r) {
                if(r.response && 'user' in r.response && 'firstName' in r.response.user) {
                    User.firstName = r.response.user.firstName;
                    User.lastName = r.response.user.lastName;
                    User.email = r.response.user.email;
                    User.isAdmin = r.response.user.isAdmin;
                }
            });
        },

        onBackClick: function() {
            var _this = this;
            var callback = function() {
                appRouter.showHome();
            };
            this.unload(callback);
        },

        onNextClick: function(ev) {
            if(ev !== null) {
                ev.preventDefault();
            }

            if(!this.reachedLimit) {
                this.loadImages();
                this.prevBtnEl.className = 'gArrow';
            } else {
                this.nextBtnEl.className = 'gArrow inactive';
            }
        },

        onPreviousClick: function(ev) {
            if(ev !== null) {
                ev.preventDefault();
            }

            if(this.rowStart > (this.rowsPerPage * this.rowLimit)) {
                this.rowStart = (this.rowStart - (this.rowsPerPage * 2 * this.rowLimit));

                if(this.rowStart === 0) {
                    this.prevBtnEl.className = 'gArrow inactive';
                }

                this.reachedLimit = false;
                this.nextBtnEl.className = 'gArrow';
                this.loadImages();
            }
        },

        reloadView: function() {
            var _this = this;
            this.unload(function() {
                _this.render();
            });
        },

        render: function() {
            if(!this.rendered) {
                this.loadUser();

                this.rendered = true;
                this.$el.append(JST['src/js/templates/gallery.html']());

                this.reset();
            } else {
                this.reset();
                this.section.fadeIn();
            }
        },

        reset: function() {
            this.rowStart = 0;
            this.reachedLimit = false;
            this.setArtEl();
            this.prevBtnEl.className = 'gArrow inactive';

            this.loadImages();
        },

        setArtEl: function() {
            if(this.artEl === null) {
                this.artEl = $(document.getElementById('gArt'));
                this.prevBtnEl = document.getElementById('gPrev');
                this.nextBtnEl = document.getElementById('gNext');
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('gallery'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new galleryView();
});