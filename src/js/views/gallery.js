define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var galleryView = Backbone.View.extend({
        el: "#content",

        onBackClick: function() {
            appRouter.showHome();
        },

        render: function(){
            this.$el.html(JST['src/js/templates/gallery.html']());
            this.setEvents();
        },

        setEvents: function() {
            var _this = this;
            $(document.getElementById('backLink')).click(function() {
                _this.onBackClick();
            });
        }
    });
    
    return new galleryView();
});