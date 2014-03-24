define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var musicViewEl = Backbone.View.extend({
        el: "#spotify",
        section: null,
        rendered: false,
        audioEl: null,
        playBtnEl: null,
        pauseBtnEl: null,
        volumeBtnEl: null,
        songTitleEl: null,
        currentSong: 1,

        events: {
            'click #mPlay': 'onPlayClick',
            'click #mPause': 'onPauseClick',
            'click #mNext': 'onNextClick',
            'click #mPrev': 'onPrevClick',
            'click #mVolume': 'onVolumeClick'
        },

        getSongName: function() {
            switch(this.currentSong) {
                case 2: return 'N.Y. State of Mind';
                case 3: return 'Life\'s a Bitch';
                case 4: return 'The World is Yours';
                case 5: return 'Halftime';
                case 6: return 'Memory Lane (Sittin\' in Da Park)';
                case 7: return 'One Love';
                case 8: return 'One Time 4 Your Mind';
                case 9: return 'Represent';
                case 10: return 'It Ain\'t Hard to Tell';
                default: return 'The Genesis';
            }
        },

        loadSong: function() {
            this.songTitleEl.innerHTML = this.getSongName();
            $(this.audioEl).html(JST['src/js/templates/song.html']({
                song: ((this.currentSong < 10) ? '0'+ this.currentSong : this.currentSong)
            }));

            this.audioEl.autoplay = false;
            this.audioEl.load();
        },

        onNextClick: function(ev) {
            if(ev !== null) {
                ev.preventDefault();
            }

            if(this.currentSong < 10) {
                this.currentSong++;
                this.loadSong();
            }
        },

        onPauseClick: function(ev) {
            ev.preventDefault();
            this.audioEl.pause();

            var _this = this;
            this.pauseBtnEl.fadeOut(function() {
                setTimeout(function() {
                    _this.playBtnEl.fadeIn();
                }, 100);
            });
        },

        onPlayClick: function(ev) {
            ev.preventDefault();
            this.audioEl.play();

            var _this = this;
            this.playBtnEl.fadeOut(function() {
                setTimeout(function() {
                    _this.pauseBtnEl.fadeIn();
                }, 100);
            });
        },

        onPrevClick: function(ev) {
            ev.preventDefault();

            if(this.currentSong > 1) {
                this.currentSong--;
                this.loadSong();
            }
        },

        onVolumeClick: function(ev) {
            ev.preventDefault();
            this.audioEl.muted = !this.audioEl.muted;

            if(this.audioEl.muted) {
                this.volumeBtnEl.addClass('muted');
            } else {
                this.volumeBtnEl.removeClass('muted');
            }
        },

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.html(JST['src/js/templates/music.html']());
                this.setAudioEl();
                this.setButtonEls();
                this.setEvents();
                this.loadSong();
            }
        },

        setAudioEl: function() {
            this.audioEl = document.getElementById('musicPlayer');
            this.songTitleEl = document.getElementById('mSongTitle');
        },

        setButtonEls: function() {
            this.playBtnEl = $(document.getElementById('mPlay'));
            this.pauseBtnEl = $(document.getElementById('mPause'));
            this.volumeBtnEl = $(document.getElementById('mVolume'));
        },

        setEvents: function() {
            var bar = $(document.getElementById('mBar')).find('span'),
                audio = this.audioEl;
            this.audioEl.addEventListener('timeupdate', function() {
                var width = 0;
                if(audio.currentTime > 0) {
                    width = Math.floor((100 / audio.duration) * audio.currentTime);
                }
                
                bar.css('width', width + '%');
            }, false);

            var _this = this;
            this.audioEl.addEventListener('ended', function() {
                _this.onNextClick(null);
            }, false);
        }
    });
    
    return new musicViewEl();
});