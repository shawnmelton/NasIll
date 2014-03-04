define(['jquery', 'backbone', 'templates/jst', 'views/lightbox'], function($, Backbone, tmplts, lightBoxViewEl){
    var galleryView = Backbone.View.extend({
        el: "#content",
        artEl: null,
        section: null,
        rendered: false,
        rowStart: 0,
        rowLimit: 5,
        reachedLimit: false,
        imageSet: [],
        
        events: {
            'click #gBackLink': 'onBackClick'
        },

        addImagesToSet: function(imgs) {
            var _this = this;
            _.each(imgs, function(img) {
                _this.imageSet.push(img.url);
            });
        },

        loadRow: function() {
            var _this = this;
            $.getJSON('/api/getGalleryArt', {
                start: this.rowStart,
                limit: this.rowLimit
            }, function(r) {
                if(r.response.reachedLimit) {
                    _this.reachedLimit = true;
                }

                _this.artEl.append(JST['src/js/templates/galleryRow.html']({
                    images: r.response.art,
                    baseIdx: _this.imageSet.length
                }));

                _this.addImagesToSet(r.response.art);

                $('#gArt img').click(function() {
                    lightBoxViewEl.render($(this).attr('src'), $(this).attr('alt'), _this.imageSet);
                });
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
            this.artEl.empty();
            
            // Load two rows to begin with.
            this.imageSet = [];
            this.loadRow();
            this.loadRow();
        },

        setArtEl: function() {
            if(this.artEl === null) {
                this.artEl = $(document.getElementById('gArt'));
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