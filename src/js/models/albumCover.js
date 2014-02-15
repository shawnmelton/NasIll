define([], function() {
    var AlbumCover = function() {};
    AlbumCover.prototype = {
        uploadedPhoto: '',
        artPhoto: ''
    };

    return new AlbumCover();
});