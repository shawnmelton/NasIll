define(['jquery', 'backbone', 'templates/jst'], function($, Backbone, tmplts){
    var fbPhotosView = Backbone.View.extend({
        el: "#content",
        rendered: false,
        section: null,

        loadPhotos: function() {
            FB.api('/me/albums', function(resp) {
                var ul = document.getElementById('albums');
                for (var i = 0, l = resp.data.length; i < l; i++) {
                    var album = resp.data[i],
                        li = document.createElement('li'),
                        a = document.createElement('a');
                    a.innerHTML = album.name;
                    a.href = album.link;
                    li.appendChild(a);
                    ul.appendChild(li);
                }
            });
        },

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