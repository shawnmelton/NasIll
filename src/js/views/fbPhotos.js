define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var fbPhotosView = Backbone.View.extend({
        el: "#content",

        render: function(){
            this.$el.html(JST['src/js/templates/fbPhotos.html']());
        }
    });
    
    return new fbPhotosView();
});