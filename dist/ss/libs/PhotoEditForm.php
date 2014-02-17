<?php
class PhotoEditForm extends BaseObject {
    private function isSubmitted() {
        return (isset($_POST['fns']) && $_POST['fns'] === 'pEdt');
    }

    public function process() {
        if($this->isSubmitted()) {
            if($this->submissionIsValid()) {
                JSON::out(array(
                    'submission' => 'success',
                    'album' => CurrentAlbumCover::get()->getArtPhotoUrl()
                ));
            }

            JSON::out(array('submission' => 'error'));
        }
    }

    private function submissionIsValid() {
        return (isset($_POST['tagText']) && $_POST['tagText'] != '' && 
            isset($_POST['zoom']) && preg_match('/^-?\d+$/', $_POST['zoom']) &&
            isset($_POST['angle']) && preg_match('/^-?\d+$/', $_POST['angle']));
    }
}