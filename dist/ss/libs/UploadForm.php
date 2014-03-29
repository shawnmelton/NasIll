<?php
class UploadForm extends BaseObject {
    private function isSubmitted() {
        return (isset($_POST['fns']) && $_POST['fns'] === 'upfm');
    }

    /**
     * Image must be jpg and less than 5MB
     */
    private function photoIsValid() {
        $this->fileTooBig = true;
        $this->wrongFileType = true;

        if(isset($_FILES['photo']['name']) && preg_match('/jpeg$|jpg$|png$|gif$/i', $_FILES['photo']['name'])) {
            $this->wrongFileType = false;
        }

        if(isset($_FILES['photo']['size']) && $_FILES['photo']['size'] > 0 && $_FILES['photo']['size'] < 2100000) {
            $this->fileTooBig = false;
        }

        return ($this->wrongFileType === false && $this->fileTooBig === false);
    }

    public function process() {
        if($this->isSubmitted()) {
            if($this->submissionIsValid()) {
                $this->save();
                $this->showUpload();
            } else if($this->wrongFileType) {
                $this->showFileTypeError();
            } else {
                $this->showSizeError();
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

        $fileExt = '.png';
        if(preg_match('/jpeg$|jpg$/i', $_FILES['photo']['name'])) {
            $fileExt = '.jpg';
        } else if(preg_match('/gif$/i', $_FILES['photo']['name'])) {
            $fileExt = '.gif';
        }

        $fileName = $directory .'/'. time() .'-'. rand(0, 10000) . $fileExt;
        copy($_FILES['photo']['tmp_name'], $fileName);

        return $fileName;
    }

    private function showFileTypeError() {
        $tmpl = new Template();
        $tmpl->content = $tmpl->render('uploadFileError');
        $tmpl->title = 'Upload Form';
        echo $tmpl->render('layout');
    }

    private function showForm($error) {
        $tmpl = new Template();
        $tmpl->content = $tmpl->render('uploadForm');
        $tmpl->title = 'Upload Form';
        $tmpl->error = $error ? '<p>There was an error with your submission.</p>' : '';
        echo $tmpl->render('layout');
    }

    private function showSizeError() {
        $tmpl = new Template();
        $tmpl->content = $tmpl->render('uploadSizeError');
        $tmpl->title = 'Upload Form';
        echo $tmpl->render('layout');
    }

    private function showUpload() {
        $tmpl = new Template();
        $tmpl->fileName = CurrentAlbumCover::get()->getFileName();
        $tmpl->content = $tmpl->render('uploaded');
        $tmpl->title = 'Uploaded';
        echo $tmpl->render('layout');
    }

    private function submissionIsValid() {
        return (isset($_FILES['photo']) && $this->photoIsValid());
    }
}