<?php
class Image {
    private $resource;

    public function __construct($file) {
        $this->resource = imagecreatefromjpeg($file);
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

    public function overlayImage($pngFile) {
        if($this->resource) {
            $png = imagecreatefrompng($pngFile);
            $this->resize(imagesx($png), imagesy($png));
            imagealphablending($png, false);
            imagesavealpha($png, true);
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

    private function resize($newWidth, $newHeight) {
        $newImg = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($newImg, $this->resource, 0, 0, 0, 0, $newWidth, $newHeight, imagesx($this->resource), imagesy($this->resource));
        $this->resource = $newImg;
    }

    public function rotate($angle) {
        if($angle != 0) {
            $this->resource = imagerotate($this->resource, $angle, imagecolorat($this->resource, 0, 0));
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