define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var lightBoxViewEl = Backbone.View.extend({
        el: 'body',
        rendered: false,
        opened: false,
        overlayEl: null,
        imgWrapperEl: null,
        nextBtnEl: null,
        prevBtnEl: null,
        imgSet: [],
        currentImg: 0,

        events: {
            'click #lbClose': 'onCloseClick',
            'click #lbNext': 'onNextClick',
            'click #lbPrev': 'onPrevClick'
        },

        addEvents: function() {
            var _this = this;
            $(document).bind('keyup', function(e) {
                if(_this.opened) {
                    switch(e.keyCode) {
                        case 27: // Escape
                            _this.onCloseClick(null);
                            break;

                        case 37: // Left Arrow
                            _this.onPrevClick(null);
                            break;

                        case 39: // Right Arrow
                            _this.onNextClick(null);
                            break;
                    }
                }
            });
        },

        loadImage: function(url) {
            this.imgWrapperEl.innerHTML = '<img src="'+ url +'" alt="Album Art">';
        },

        onCloseClick: function(ev) {
            document.getElementsByTagName('body')[0].className = '';
            $('.overlayBG').remove();

            if(ev !== null) {
                ev.preventDefault();
            }

            var wrapper = this.imgWrapperEl;
            this.overlayEl.fadeOut(function() {
                wrapper.innerHTML = '';
            });

            $(document).unbind('keyup');
            this.opened = false;
        },

        onNextClick: function(ev) {
            if(ev !== null) {
                ev.preventDefault();
            }

            this.prevBtnEl.className = '';

            if(this.currentImg < (this.imgSet.length - 1)) {
                this.currentImg++;
                this.loadImage(this.imgSet[this.currentImg]);
            } 

            if(this.currentImg === (this.imgSet.length - 1)) {
                this.nextBtnEl.className = 'inactive';
            }
        },

        onPrevClick: function(ev) {
            if(ev !== null) {
                ev.preventDefault();
            }

            this.nextBtnEl.className = '';

            if(this.currentImg > 0) {
                this.currentImg--;
                this.loadImage(this.imgSet[this.currentImg]);
            } 

            if(this.currentImg === 0) {
                this.prevBtnEl.className = 'inactive';
            }
        },

        render: function(imgUrl, imgPlace, imgSet) {
            this.currentImg = imgPlace;
            this.imgSet = imgSet;

            document.getElementsByTagName('body')[0].className = 'overlay';

            if(this.rendered === false) {
                this.$el.append(JST['src/js/templates/lightbox.html']());
                this.rendered = true;
                this.setOverlayEl();
            } else {
                this.overlayEl.fadeIn();
            }

            this.overlayEl.before('<div class="overlayBG"></div>');
            this.reset();
            this.loadImage(imgUrl);
        },

        reset: function() {
            this.prevBtnEl.className = '';
            this.nextBtnEl.className = '';

            if(this.currentImg === 0) {
                this.prevBtnEl.className = 'inactive';
            }

            if(this.currentImg === (this.imgSet.length - 1)) {
                this.nextBtnEl.className = 'inactive';
            }

            this.opened = true;
            this.addEvents();
        },

        setOverlayEl: function() {
            this.overlayEl = $(document.getElementById('lbOverlay'));
            this.imgWrapperEl = document.getElementById('lbImgWrapper');
            this.nextBtnEl = document.getElementById('lbNext');
            this.prevBtnEl = document.getElementById('lbPrev');
        }
    });
    
    return new lightBoxViewEl();
});