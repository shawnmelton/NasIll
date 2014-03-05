define(['jquery', 'backbone', 'templates/jst', 'views/lightbox', 'tools/random'],
    function($, Backbone, tmplts, lightBoxViewEl, Random){
    var galleryView = Backbone.View.extend({
        el: "#content",
        artEl: null,
        section: null,
        rendered: false,
        rowStart: 0,
        rowLimit: 5,
        rowsPerPage: 2,
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
                _this.imageSet.push(img.url);
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

            for(var i = 1; i <= this.rowsPerPage; i++) {
                if(i === this.rowsPerPage) {
                    this.loadRow(callback);
                } else {
                    this.loadRow();
                }
            }
        },

        loadRow: function(callback) {
            var _this = this;
            $.getJSON('/api/getGalleryArt', {
                start: this.rowStart,
                limit: this.rowLimit,
                r: Random.get()
            }, function(r) {
                if(r.response.reachedLimit) {
                    _this.reachedLimit = true;
                    _this.nextBtnEl.className = 'gArrow inactive';
                }

                if(r.response.art.length > 0) {
                    _this.artEl.append(JST['src/js/templates/galleryRow.html']({
                        images: r.response.art,
                        baseIdx: _this.imageSet.length
                    }));

                    _this.addImagesToSet(r.response.art);
                }

                if(typeof callback !== 'undefined') {
                    setTimeout(callback, 100);
                }
            });

            this.rowStart += this.rowLimit;
        },

        onBackClick: function() {
            var _this = this;
            var callback = function() {
                appRouter.showHome();
            };
            this.unload(callback);
        },

        onNextClick: function(ev) {
            ev.preventDefault();
            this.prevBtnEl.className = 'gArrow';

            if(!this.reachedLimit) {
                this.loadImages();   
            } else {
                this.nextBtnEl.className = 'gArrow inactive';
            }
        },

        onPreviousClick: function(ev) {
            ev.preventDefault();
            this.nextBtnEl.className = 'gArrow';

            if(this.rowStart > (this.rowsPerPage * this.rowLimit)) {
                this.rowStart = (this.rowStart - (this.rowsPerPage * 2 * this.rowLimit));

                if(this.rowStart === 0) {
                    this.prevBtnEl.className = 'gArrow inactive';
                }

                this.loadImages();
            }
        },

        render: function() {
            if(!this.rendered) {
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