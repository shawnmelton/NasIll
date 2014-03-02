define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var thankYouMblView = Backbone.View.extend({
        el: "#content",
        section: null,
        rendered: false,

        events: {
            'click #tyGalleryLink': 'onGalleryClick'
        },

        onGalleryClick: function() {
            var callback = function() {
                appRouter.showGallery();
            };
            this.unload(callback);
        },

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/thankYouMobile.html']());
            } else {
                this.section.fadeIn();
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('tyMobile'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new thankYouMblView();
});