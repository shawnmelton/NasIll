<?php
class AccountForm extends BaseObject {
    private function isSubmitted() {
        return (isset($_POST['fns']) && $_POST['fns'] === 'acct');
    }

    public function process() {
        if($this->isSubmitted()) {
            if($this->submissionIsValid()) {
                $this->save();

                // Make sure that we have a file upload as well before we show success.
                if(CurrentAlbumCover::get()->getUploadedPhoto() !== '') {
                    JSON::out(array(
                        'submission' => 'success',
                        'photo' => CurrentAlbumCover::get()->getUploadedPhotoUrl()
                    ));
                }
            }

            JSON::out(array('submission' => 'error'));
        }
    }

    protected function save() {
        $user = CurrentUser::get();
        $user->setFirstName($_POST['firstName']);
        $user->setLastName($_POST['lastName']);
        $user->setEmail($_POST['email']);
        $user->save();
    }

    private function submissionIsValid() {
        return (isset($_POST['email']) && isset($_POST['firstName']) && isset($_POST['lastName']) 
            && $_POST['firstName'] != '' && $_POST['lastName'] != '' &&
            preg_match('/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $_POST['email']));
    }
}