define([], function() {
    var AlbumCover = function() {};
    AlbumCover.prototype = {
        uploadedPhoto: '',
        artPhoto: '',
        fileName: '',
        uploadedPhotoWidth: 0,
        uploadedPhotoHeight: 0,
        uploadedFromFacebook: false
    };

    return new AlbumCover();
});