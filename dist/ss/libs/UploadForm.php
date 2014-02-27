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
        $album = CurrentAlbumCover::get();
        $album->setUploadedPhoto($fileName);
        $album->setFileName($_FILES['photo']['name']);
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
        $tmpl->content = $tmpl->render('uploaded');
        $tmpl->title = 'Uploaded';
        echo $tmpl->render('layout');
    }

    private function submissionIsValid() {
        return (isset($_FILES['photo']) && $this->photoIsValid());
    }
}