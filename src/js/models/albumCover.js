define([], function() {
    var AlbumCover = function() {};
    AlbumCover.prototype = {
        uploadedPhoto: '',
        artPhoto: '',
        fileName: '',
        uploadedPhotoWidth: 0
    };

    return new AlbumCover();
});