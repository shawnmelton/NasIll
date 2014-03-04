define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var lightBoxViewEl = Backbone.View.extend({
        el: 'body',
        rendered: false,
        overlayEl: null,
        imgWrapperEl: null,
        imgSet: [],
        currentImg: 0,

        events: {
            'click #lbClose': 'onCloseClick',
            'click #lbNext': 'onNextClick',
            'click #lbPrev': 'onPrevClick'
        },

        loadImage: function(url) {
            this.imgWrapperEl.innerHTML = '<img src="'+ url +'" alt="Album Art">';
        },

        onCloseClick: function(ev) {
            ev.preventDefault();

            var wrapper = this.imgWrapperEl;
            this.overlayEl.fadeOut(function() {
                wrapper.innerHTML = '';
            });
        },

        onNextClick: function(ev) {
            ev.preventDefault();

            if(this.currentImg < (this.imgSet.length - 1)) {
                this.currentImg++;
                this.loadImage(this.imgSet[this.currentImg]);
            }
        },

        onPrevClick: function(ev) {
            ev.preventDefault();

            if(this.currentImg > 0) {
                this.currentImg--;
                this.loadImage(this.imgSet[this.currentImg]);
            }
        },

        render: function(imgUrl, imgPlace, imgSet) {
            if(this.rendered === false) {
                this.$el.append(JST['src/js/templates/lightbox.html']());
                this.rendered = true;
                this.setOverlayEl();
            } else {
                this.overlayEl.fadeIn();
            }

            this.imgSet = imgSet;
            this.currentImg = imgPlace;
            this.loadImage(imgUrl);
        },

        setOverlayEl: function() {
            this.overlayEl = $(document.getElementById('lbOverlay'));
            this.imgWrapperEl = document.getElementById('lbImgWrapper');
        }
    });
    
    return new lightBoxViewEl();
});