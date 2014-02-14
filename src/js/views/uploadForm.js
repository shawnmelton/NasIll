define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var uploadFormView = Backbone.View.extend({
        el: "#content",

        onContinueClick: function() {
            appRouter.show
        },

        onResetClick: function() {
            document.getElementById('uploadFrame').src = '/ss/upload.php';
        },

        render: function(){
            this.$el.html(JST['src/js/templates/uploadForm.html']());
        },

        setEvents: function() {
            var _this = this;
            $(document.getElementById('resetLink')).click(function() {
                _this.onResetClick();
            });

            $(document.getElementById('continueLink')).click(function() {
                _this.onContinueClick();
            });
        }
    });
    
    return new uploadFormView();
});