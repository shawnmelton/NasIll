<?php
class UploadForm extends BaseObject {
    private function isSubmitted() {
        return (isset($_POST['fns']) && $_POST['fns'] === 'upfm');
    }

    /**
     * Image must be jpg and less than 5MB
     */
    private function photoIsValid() {
        return (isset($_FILES['photo']['name']) && preg_match('/jpeg$|jpg$/', $_FILES['photo']['name']) &&
            isset($_FILES['photo']['size']) && $_FILES['photo']['size'] > 0 && $_FILES['photo']['size'] < 5000000);
    }

    public function process() {
        if($this->isSubmitted()) {
            if($this->submissionIsValid()) {
                $this->save();
                $this->showUpload();
            } else {
                $this->showForm(true);
            }
        } else {
            $this->showForm(false);
        }
    }

    protected function save() {
        $fileName = $this->storeFile();

        // Update the user's account.
        /*$user = CurrentUser::get();
        $user->setFirstName($_POST['firstName']);
        $user->setLastName($_POST['lastName']);
        $user->setEmail($_POST['email']);
        $user->save();*/

        $album = CurrentAlbumCover::get();
        $album->setUploadedPhoto($fileName);
        $album->save();
    }

    private function storeFile() {
        $directory = dirname(dirname(__FILE__)) .'/uploads/'. date('m/d/G');
        if(!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        $fileName = $directory .'/'. time() .'-'. rand(0, 10000) .'.jpg';
        copy($_FILES['photo']['tmp_name'], $fileName);

        return $fileName;
    }

    private function showForm($error) {
        $tmpl = new Template();
        $tmpl->content = $tmpl->render('uploadForm');
        $tmpl->title = 'Upload Form';
        $tmpl->error = $error ? '<p>There was an error with your submission.</p>' : '';
        echo $tmpl->render('layout');
    }

    private function showUpload() {
        $tmpl = new Template();
        $tmpl->fileName = CurrentAlbumCover::get()->getUploadedPhotoUrl();
        /*$tmpl->userName = $_POST['firstName'] .' '. $_POST['lastName'];
        $tmpl->email = $_POST['email'];*/
        $tmpl->content = $tmpl->render('uploaded');
        $tmpl->title = 'Uploaded';
        echo $tmpl->render('layout');
    }

    /*
        isset($_POST['email']) && isset($_POST['firstName']) 
            && isset($_POST['lastName']) && $_POST['firstName'] != '' && $_POST['lastName'] != '' &&
            preg_match('/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $_POST['email']) &&
            
     */
    private function submissionIsValid() {
        return (isset($_FILES['photo']) && $this->photoIsValid());
    }
}