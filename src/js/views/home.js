define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var homeView = Backbone.View.extend({
        el: "#content",
        rendered: false,
        section: null,

        events: {
            'click #hFbLink': 'onFacebookClick',
            'click #hGalleryLink': 'onGalleryClick',
            'click #hUploadLink': 'onUploadClick'
        },

        onFacebookClick: function() {
            
        },

        onGalleryClick: function() {
            var callback = function() {
                appRouter.showGallery();
            };
            this.unload(callback);
        },

        onUploadClick: function() {
            var callback = function() {
                appRouter.showUploadForm();
            };
            this.unload(callback);
        },

        render: function() {
            if(!this.rendered) {
                this.rendered = true;
                this.$el.append(JST['src/js/templates/home.html']());
            } else {
                this.section.fadeIn();
            }
        },

        setSection: function() {
            if(this.section === null) {
                this.section = $(document.getElementById('home'));
            }
        },

        unload: function(callback) {
            this.setSection();
            this.section.fadeOut(function() {
                callback(); 
            });
        }
    });
    
    return new homeView();
});