define(['jquery', 'backbone', 'templates/jst', 'models/albumCover', 'libs/jquery-ui-slider', 'libs/imgRotate', 'tools/random'], 
    function($, Backbone, tmplts, AlbumCover, jqui, ir, Random){
    var photoEditView = Backbone.View.extend({
        el: "#content",
        errorMsg: null,
        form: null,
        image: null,
        section: null,
        rendered: false,
        originalImgWidth: 0,

        events: {
            'click #peContinueLink': 'onContinueClick',
            'click #peBackLink': 'onBackClick',
            'submit #photoEditForm': 'onContinueClick'
        },

        goToReview: function() {
            var callback = function() {
                appRouter.showReview();
            };
            this.unload(callback);
        },

        initSliders: function() {
            var _this = this;
            var zoomEl = document.getElementById('zoom');
            $(document.getElementById('zoomSlider')).slider({
                max: 10,
                min: -10,
                step: 1,
                slide: function(event, ui) {
                    var value = ui.value;
                    if(ui.value < 0) { 
                        value = (1 / (ui.value * -1));
                    } else if(ui.value === 0) {
                        value = 1;
                    }

                    zoom.value = value;
                    _this.setImageZoom(value);
                }
            });

            var angleEl = document.getElementById('angle');
            $(document.getElementById('angleSlider')).slider({
                max: 180,
                min: -180,
                step: 10,
                slide: function(event, ui) {
                    angleEl.value = ui.value;
                    _this.setImageAngle(ui.value);
                }
            });
        },

        onBackClick: function() {
            var callback;
            if(/* Logged in with FB */ false) {

            } else {
                callback = function() {
                    appRouter.showUploadForm();
                };
            }

            this.unload(callback);
        },

        onContinueClick: function(ev) {
            ev.preventDefault();
            this.setFormEl();

            var _this = this;
            $.post('/api/generateAlbumArt?r='+ Random.get(), this.form.serialize(), function(rText) {
                var r = JSON.parse(rText);
                if(r.response && r.response.submission) {
                    if(r.response.submission === 'success') {
                        AlbumCover.artPhoto = r.response.album;
                        _this.goToReview();

                        _this.setErrorEl();
                        _this.errorMsg.fadeOut();
                    } else {
                        _this.setErrorEl();
                        _this.errorMsg.fadeIn();
                    }
                }
            });
        },

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/photoEdit.html']({
                    photoUrl: AlbumCover.uploadedPhoto
                }));

                this.initSliders();
                this.setImageEl();
            } else {
                document.getElementById('peUploadedPhoto').src = AlbumCover.uploadedPhoto;
                this.section.fadeIn();
            }
        },

        setErrorEl: function() {
            if(this.errorMsg === null) {
                this.errorMsg = $(document.getElementById('peErrorMsg'));
            }
        },

        setFormEl: function() {
            if(this.form === null) {
                this.form = $(document.getElementById('photoEditForm'));
            }
        },

        setImageAngle: function(angle) {
            $(this.image).rotate(angle);
        },

        setImageEl: function() {
            if(this.image === null) {
                this.image = document.getElementById('peUploadedPhoto');
                this.originalImgWidth = AlbumCover.uploadedPhotoWidth;
                this.setImageZoom(1);
            }
        },

        setImageZoom: function(zoom) {
            var imgWidth = (parseInt(this.originalImgWidth) * zoom);
            this.image.style.width = imgWidth +'px';
            this.image.style.marginLeft = '-'+ (imgWidth / 2) +'px';

            var _this = this;
            setTimeout(function() { // Wait for image to download.
                _this.image.style.marginTop = '-'+ (_this.image.clientHeight / 2) +'px';
            }, 1000);
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('photoEdit'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new photoEditView();
});