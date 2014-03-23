<?php
class API {
    public function __call($name, $args) {
        /* Do nothing.  Let code fall through. */
    }

    public function download() {
        if(CurrentAlbumCover::get()->getArtPhoto() !== false && CurrentAlbumCover::get()->getArtPhoto() !== '') {
            header('Cache-Control: no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('Expires: Sat, 26 Jul 1997 05:00:00 GMT'); // Date in the past
            header('Content-disposition: attachment; filename=IllMaticAlbumArt.png');
            header('Content-Type: image/png');
            readfile(CurrentAlbumCover::get()->getArtPhoto());
            exit;
        }
    }

    public function generateAlbumArt() {
        $form = new PhotoEditForm();
        $form->process();
    }

    public function getGalleryArt() {
        if(isset($_GET['start']) && preg_match('/^\d+$/', $_GET['start']) && isset($_GET['limit']) && preg_match('/^\d+$/', $_GET['limit'])) {
            $albumCovers = new AlbumCovers();
            $results = $albumCovers->getArt($_GET['start'], $_GET['limit']);
            JSON::out(array(
                'art' => $results,
                'reachedLimit' => (count($results) < $_GET['limit'])
            ));
        }
    }

    public function getUploadedPhoto() {
        $img = new Image(CurrentAlbumCover::get()->getUploadedPhoto());
        JSON::out(array(
            'submission' => 'success',
            'photo' => CurrentAlbumCover::get()->getUploadedPhotoUrl(),
            'width' => $img->getWidth(),
            'height' => $img->getHeight(),
            'fileName' => CurrentAlbumCover::get()->getFileName()
        ));
    }

    public function request($action) {
        $this->$action();
    }

    public function saveAccountInfo() {
        $form = new AccountForm();
        $form->process();
    }

    public function upload() {
        $form = new UploadForm();
        $form->process();
        exit;
    }
}