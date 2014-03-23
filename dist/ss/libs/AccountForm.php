<?php
class AccountForm extends BaseObject {
    private $imgUploaded = false;
    private $newUser = false;

    private function isSubmitted() {
        return (isset($_POST['fns']) && $_POST['fns'] === 'acct');
    }

    public function process() {
        if($this->isSubmitted()) {
            if($this->submissionIsValid()) {
                $this->save();

                if($this->imgUploaded) { // Send photo upload information back.
                    $img = new Image(CurrentAlbumCover::get()->getUploadedPhoto());

                    JSON::out(array(
                        'submission' => 'success',
                        'userFound' => ($this->newUser === false),
                        'photo' => CurrentAlbumCover::get()->getUploadedPhotoUrl(),
                        'width' => $img->getWidth(),
                        'height' => $img->getHeight()
                    ));
                }

                JSON::out(array('submission' => 'success'));
            }

            JSON::out(array('submission' => 'error'));
        }
    }

    protected function save() {
        $user = CurrentUser::get();
        $user->setFirstName($_POST['firstName']);
        $user->setLastName($_POST['lastName']);
        $user->setEmail($_POST['email']);

        if(!$user->find()) {
            $user->save();
            $this->newUser = true;
        }

        // If a photo is uploaded using Facebook, then download it to our server.
        if(isset($_POST['photo']) && $_POST['photo'] != '') {
            $this->savePhoto();
            $this->imgUploaded = true;
        }
    }

    private function savePhoto() {
        CurrentAlbumCover::get()->setUploadedPhoto(ImageDownload::fromUrl($_POST['photo']));
        CurrentAlbumCover::get()->save();
    }

    private function submissionIsValid() {
        return (isset($_POST['email']) && isset($_POST['firstName']) && isset($_POST['lastName']) 
            && $_POST['firstName'] != '' && $_POST['lastName'] != '' &&
            preg_match('/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $_POST['email']));
    }
}