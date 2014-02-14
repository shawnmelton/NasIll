define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var photoEditView = Backbone.View.extend({
        el: "#content",

        render: function(){
            this.$el.html(JST['src/js/templates/photoEdit.html']());
        },

        setEvents: function() {
            var _this = this;
            /*$(document.getElementById('resetLink')).click(function() {
                _this.onResetClick();
            });*/
        }
    });
    
    return new photoEditView();
});