define(['jquery', 'backbone', 'templates/jst', 'models/albumCover', 'models/user', 'libs/jquery-ui-slider', 'libs/imgRotate', 'tools/random'], 
    function($, Backbone, tmplts, AlbumCover, User, jqui, ir, Random){
    var photoEditView = Backbone.View.extend({
        el: "#content",
        errorMsg: null,
        form: null,
        image: null,
        section: null,
        rendered: false,
        originalImgWidth: 0,
        drag: {},

        events: {
            'click #peContinueLink': 'onContinueClick',
            'click #peBackLink': 'onBackClick',
            'mousedown #pePhotoOverlay': 'onPhotoDragStart',
            'mousemove #pePhotoOverlay': 'onPhotoDragging',
            'mouseout #pePhotoOverlay': 'onPhotoDragStop',
            'mouseup #pePhotoOverlay': 'onPhotoDragStop',
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
            if(AlbumCover.uploadedFromFacebook) {
                callback = function() {
                    appRouter.showFacebookPhotos();
                };
            } else {
                callback = function() {
                    appRouter.showConfirmPhoto();
                };
            }

            this.unload(callback);
        },

        onContinueClick: function(ev) {
            ev.preventDefault();
            this.setFormEl();

            if(this.drag.hasBeenApplied) {
                document.getElementById('cropx').value = this.drag.original.x - this.drag.offset.x;
                document.getElementById('cropy').value = this.drag.original.y - this.drag.offset.y;
            }

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

        onPhotoDragStart: function(ev) {
            ev.preventDefault();

            this.drag.inProgress = true;
            this.drag.hasBeenApplied = true;
            this.drag.start = {
                x: ev.clientX,
                y: ev.clientY
            };
        },

        onPhotoDragging: function(ev) {
            ev.preventDefault();

            if(this.drag.inProgress) {
                this.image.style.marginLeft = this.drag.offset.x + (ev.clientX - this.drag.start.x) +'px';
                this.image.style.marginTop = this.drag.offset.y + (ev.clientY - this.drag.start.y) +'px';
            }
        },

        onPhotoDragStop: function(ev) {
            ev.preventDefault();

            if(this.drag.inProgress) {
                this.drag.inProgress = false;

                this.drag.offset = {
                    x: this.drag.offset.x + (ev.clientX - this.drag.start.x),
                    y: this.drag.offset.y + (ev.clientY - this.drag.start.y)
                };

                this.image.style.marginLeft = this.drag.offset.x +'px';
                this.image.style.marginTop = this.drag.offset.y +'px';
            }
        },

        render: function() {
            if(!this.rendered) {
                this.drag = {
                    inProgress: false,
                    hasBeenApplied: false,
                    start: {},
                    offset: {},
                    original: {}
                };

                this.rendered = true;
                this.$el.append(JST['src/js/templates/photoEdit.html']({
                    photoUrl: AlbumCover.uploadedPhoto,
                    firstName: User.firstName.substring(0, 16)
                }));

                this.initSliders();
                this.setImageEl();
            } else {
                this.section.fadeIn();
            }

            // Reset the image.
            if(document.getElementById('peUploadedPhoto').src.indexOf(AlbumCover.uploadedPhoto) === -1) {
                document.getElementById('peUploadedPhoto').src = AlbumCover.uploadedPhoto;

                this.drag = {
                    inProgress: false,
                    hasBeenApplied: false,
                    start: {},
                    offset: {},
                    original: {}
                };

                $(document.getElementById('zoomSlider')).slider('value', 0);
                $(document.getElementById('angleSlider')).slider('value', 0);

                this.originalImgWidth = AlbumCover.uploadedPhotoWidth;
                this.setImageAngle(0);
                this.setImageZoom(1);
            } else {
                //$(document.getElementById('zoomSlider')).slider('value', parseInt(document.getElementById('zoom').value));
                //$(document.getElementById('angleSlider')).slider('value', parseInt(document.getElementById('angle').value));
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

            if(!this.drag.hasBeenApplied) { // Once this image has been dragged, don't center it again.
                this.drag.original.x = this.drag.offset.x = ((imgWidth / 2) * -1);
                this.image.style.marginLeft = this.drag.offset.x +'px';

                var _this = this;
                setTimeout(function() { // Wait for image to download.
                    _this.drag.original.y = _this.drag.offset.y = ((_this.image.clientHeight / 2) * -1);
                    _this.image.style.marginTop = _this.drag.offset.y +'px';
                }, 250);
            }
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