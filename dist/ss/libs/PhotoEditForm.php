<?php
class PhotoEditForm extends BaseObject {
    private function isSubmitted() {
        return (isset($_POST['fns']) && $_POST['fns'] === 'pEdt');
    }

    private function generateAlbumArt() {
        $img = new Image(CurrentAlbumCover::get()->getUploadedPhoto());
        $img->resize($_POST['zoom']);
        //$img->rotate(($_POST['angle'] * -1));
        $img->overlayImage(dirname(dirname(dirname(__FILE__))) .'/img/artOverlayLayer.png');
        return $img->overlayText($_POST['tagText'], 40, array(255, 15, 15));
    }

    public function process() {
        if($this->isSubmitted()) {
            if($this->submissionIsValid()) {
                JSON::out(array(
                    'submission' => ($this->generateAlbumArt() ? 'success' : 'error'),
                    'album' => CurrentAlbumCover::get()->getArtPhotoUrl()
                ));
            }

            JSON::out(array('submission' => 'error'));
        }
    }

    private function submissionIsValid() {
        return (isset($_POST['tagText']) && $_POST['tagText'] != '' && 
            isset($_POST['angle']) && preg_match('/^-?\d+$/', $_POST['angle']) &&
            isset($_POST['zoom']) && preg_match('/^\d+(\.\d+)?$/', $_POST['zoom']));
    }
}