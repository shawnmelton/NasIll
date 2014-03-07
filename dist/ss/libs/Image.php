<?php
class Image {
    private $resource;

    public function __construct($file) {
        $this->resource = imagecreatefromjpeg($file);
    }

    public function crop($newWidth, $newHeight, $x, $y) {
        $newImg = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($newImg, $this->resource, 0, 0, $x, $y, $newWidth, $newHeight, $newWidth, $newHeight);
        $this->resource = $newImg;

        /*header('Content-Type: image/jpeg');
        imagejpeg($this->resource);
        exit;*/
    }

    private function getColor($colorArr) {
        return imagecolorallocate($this->resource, $colorArr[0], $colorArr[1], $colorArr[2]);
    }

    private function getFontFile() {
        return dirname(dirname(__FILE__)) .'/fonts/OpenSans-Regular.ttf';
    }

    private function getTextXPos($text, $fontSize) {
        $coords = imagettfbbox($fontSize, 0, $this->getFontFile(), $text);
        return ((imagesx($this->resource) * .97) - $coords[2]);
    }

    private function getTextYPos($fontSize) {
        return ((imagesy($this->resource) * .03) + $fontSize);
    }

    public function getWidth() {
        return imagesx($this->resource);
    }

    public function overlayImage($png) {
        if($this->resource) {
            imagealphablending($png, false);
            imagesavealpha($png, true);

            $newImg = imagecreatetruecolor(imagesx($png), imagesy($png));
            imagecopy($newImg, $this->resource, 0, 0, 0, 0, imagesx($png), imagesy($png));
            $this->resource = $newImg;

            imagecopy($this->resource, $png, 0, 0, 0, 0, imagesx($png), imagesy($png));
        }
    }

    public function overlayText($text, $fontSize, $color) {
        if($this->resource) {
            if(imagettftext($this->resource, $fontSize, 0, $this->getTextXPos($text, $fontSize), $this->getTextYPos($fontSize), $this->getColor($color), $this->getFontFile(), $text)) {
                return ($this->store() !== false);
            }
        }

        return false;
    }

    public function resize($zoom) {
        if($zoom == 0) {
            return false;
        }

        $newWidth = (imagesx($this->resource) * $zoom);
        $newHeight = (imagesy($this->resource) * $zoom);
        $newImg = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($newImg, $this->resource, 0, 0, 0, 0, $newWidth, $newHeight, imagesx($this->resource), imagesy($this->resource));
        $this->resource = $newImg;
    }

    public function rotate($angle) {
        if($angle != 0) {
            $this->resource = imagerotate($this->resource, $angle, 0);
        }
    }

    private function store() {
        $directory = dirname(dirname(__FILE__)) .'/uploads/'. date('m/d/G');
        if(!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        $fileName = $directory .'/art-'. time() .'-'. rand(0, 10000) .'.jpg';
        if(imagejpeg($this->resource, $fileName)) {
            CurrentAlbumCover::get()->setArtPhoto($fileName);
            CurrentAlbumCover::get()->save();
            imagedestroy($this->resource);

            return true;
        }

        return false;
    }
}