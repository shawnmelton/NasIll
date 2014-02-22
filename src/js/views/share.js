define(['jquery', 'backbone', 'templates/jst', 'models/albumCover'], function($, Backbone, tmplts, AlbumCover){
    var shareView = Backbone.View.extend({
        el: "#content",
        section: null,
        rendered: false,

        events: {
            'click #sFbLink': 'onFacebookClick',
            'click #sTwLink': 'onTwitterClick',
            'click #sBuyLink': 'onBuyClick',
            'click #sGalleryLink': 'onGalleryClick',
            'click #sInstLink': 'onInstagramClick'
        },

        onBuyClick: function() {},

        onFacebookClick: function() {},

        onGalleryClick: function() {},

        onInstagramClick: function() {},

        onTwitterClick: function() {},

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/share.html']({
                    photoUrl: AlbumCover.artPhoto    
                }));
            } else {
                this.section.fadeIn();
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('share'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new shareView();
});