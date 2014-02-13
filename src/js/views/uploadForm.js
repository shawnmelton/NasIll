define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var uploadFormView = Backbone.View.extend({
        el: "#content",

        render: function(){
            this.$el.html(JST['src/js/templates/uploadForm.html']());
        }
    });
    
    return new uploadFormView();
});