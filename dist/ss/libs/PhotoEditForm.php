<?php
class PhotoEditForm extends BaseObject {
    private function isSubmitted() {
        return (isset($_POST['fns']) && $_POST['fns'] === 'pEdt');
    }

    private function generateAlbumArt() {
        $img = new Image(CurrentAlbumCover::get()->getUploadedPhoto());

        if($_POST['angle'] % 90 != 0) {
            $_POST['zoom'] *= .8;
        }

        $img->resize($_POST['zoom']);
        $img->rotate(($_POST['angle'] * -1));
        $img->crop($_POST['cropx'], $_POST['cropy']);
        $img->cropFace2();
        $img->overlayOnAlbum();
        $img->overlayOrangeHue();
        $img->overlayTopLayer();
        if($img->overlayText(strtolower($_POST['tagText']), array(159, 56, 29))) {
            return $img->store();
        }

        return false;
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
        return (isset($_POST['tagText']) && $_POST['tagText'] != '' && strlen($_POST['tagText']) < 16 && 
            isset($_POST['cropx']) && preg_match('/^-?\d+$/', $_POST['cropx']) &&
            isset($_POST['cropy']) && preg_match('/^-?\d+$/', $_POST['cropy']) &&
            isset($_POST['angle']) && preg_match('/^-?\d+$/', $_POST['angle']) &&
            isset($_POST['zoom']) && preg_match('/^\d+(\.\d+)?$/', $_POST['zoom']));
    }
}