<?php
class PhotoEditForm extends BaseObject {
    private $fontSize;
    private $dimensions;
    private $text;

    public function __construct() {
        $this->fontSize = 40;
    }

    private function isSubmitted() {
        return (isset($_POST['fns']) && $_POST['fns'] === 'pEdt');
    }

    private function generateAlbumArt() {
        $_POST['tagText'] = 'TESTING';
        $this->text = strtoupper($_POST['tagText']);
        
        $img = imagecreatefromjpeg(CurrentAlbumCover::get()->getUploadedPhoto());
        if($img) {
            $red = imagecolorallocate($img, 255, 15, 15); // rgb
            if(imagettftext($img, $this->fontSize, 0, $this->getTextXPos(), $this->getTextYPos(), $red, $this->getFontFile(), $this->text)) {
                header('Content-Type: image/jpeg');
                imagejpeg($img);
                exit;
                //return ($this->storeFile($img) !== false);
            }
        }

        return false;
    }

    private function getFontFile() {
        return dirname(dirname(__FILE__)) .'/fonts/OpenSans-Regular.ttf';
    }

    private function getTextXPos() {
        $dimensions = getimagesize(CurrentAlbumCover::get()->getUploadedPhoto());
        $coords = imagettfbbox($this->fontSize, 0, $this->getFontFile(), $this->text);
        return (($dimensions[0] * .97) - $coords[2]);
    }

    private function getTextYPos() {
        $dimensions = getimagesize(CurrentAlbumCover::get()->getUploadedPhoto());
        return (($dimensions[1] * .03) + $this->fontSize);
    }

    public function process() {
        //if($this->isSubmitted()) {
            //if($this->submissionIsValid()) {
                $status = $this->generateAlbumArt() ? 'success' : 'error';

                JSON::out(array(
                    'submission' => $status,
                    'album' => CurrentAlbumCover::get()->getArtPhotoUrl()
                ));
            //}

            JSON::out(array('submission' => 'error'));
        //}
    }

    private function storeFile($imgResource) {
        $directory = dirname(dirname(__FILE__)) .'/uploads/'. date('m/d/G');
        if(!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        $fileName = $directory .'/art-'. time() .'-'. rand(0, 10000) .'.jpg';
        if(imagejpeg($imgResource, $fileName)) {
            CurrentAlbumCover::get()->setArtPhoto($fileName);
            CurrentAlbumCover::get()->save();
            imagedestroy($imgResource);

            return $fileName;
        }

        return false;
    }

    private function submissionIsValid() {
        return (isset($_POST['tagText']) && $_POST['tagText'] != '' && 
            isset($_POST['zoom']) && preg_match('/^-?\d+$/', $_POST['zoom']) &&
            isset($_POST['angle']) && preg_match('/^-?\d+$/', $_POST['angle']));
    }
}