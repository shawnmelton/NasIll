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

    public function getCurrentUser() {
        $info = CurrentUser::get()->getInfo();

        unset($info['id']);
        unset($info['checkdinId']);

        JSON::out(array(
            'user' => $info
        ));
    }

    public function getGalleryArt() {
        if(isset($_GET['start']) && preg_match('/^\d+$/', $_GET['start']) && isset($_GET['limit']) && preg_match('/^\d+$/', $_GET['limit'])) {
            $albumCovers = new AlbumCovers();
            $results = $albumCovers->getArt($_GET['start'], $_GET['limit']);
            $reachedLimit = false;

            if(count($results) == ($_GET['limit'] + 1)) { // Pop the last element because it belongs in the next result set.
                array_pop($results);
            } else {
                $reachedLimit = true;
            }

            JSON::out(array(
                'art' => $results,
                'reachedLimit' => $reachedLimit
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

    public function imageD() {
        if(isset($_GET['id']) && preg_match('/^\d+$/', $_GET['id']) && CurrentUser::get()->isAdmin()) {
            AlbumCover::delete($_GET['id']);

            JSON::out(array(
                'submission' => 'success'
            ));
        }
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