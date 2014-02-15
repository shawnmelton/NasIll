define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var fbPhotosView = Backbone.View.extend({
        el: "#content",
        rendered: false,
        section: null,

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/fbPhotos.html']());
            } else {
                this.section.fadeIn();
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('fbPhotos'));
            }
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