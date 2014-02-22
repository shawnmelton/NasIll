define([], function() {
    var AlbumCover = function() {};
    AlbumCover.prototype = {
        uploadedPhoto: '',
        artPhoto: '',
        uploadedPhotoWidth: 0
    };

    return new AlbumCover();
});