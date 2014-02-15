define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var galleryView = Backbone.View.extend({
        el: "#content",
        section: null,
        rendered: false,
        
        events: {
            'click #gBackLink': 'onBackClick'
        },

        onBackClick: function() {
            var callback = function() {
                appRouter.showHome();
            };
            this.unload(callback);
        },

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/gallery.html']());
            } else {
                this.section.fadeIn();
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