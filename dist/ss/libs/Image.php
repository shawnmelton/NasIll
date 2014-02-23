<?php
class Image {
    private $resource;

    public function __construct($file) {
        $this->resource = imagecreatefromjpeg($file);
    }

    private function crop($newWidth, $newHeight) {
        $newImg = imagecreatetruecolor($newWidth, $newHeight);

        $startingX = 0;
        if(imagesx($this->resource) > $newWidth) {
            $startingX = floor((imagesx($this->resource) - $newWidth) / 2.5);
        }

        $startingY = 0;
        if(imagesy($this->resource) > $newHeight) {
            $startingY = floor((imagesy($this->resource) - $newHeight) / 2.5);
        }

        imagecopyresampled($newImg, $this->resource, 0, 0, $startingX, $startingY, $newWidth, $newHeight, ($startingX + $newWidth), ($startingY + $newHeight));
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

    public function overlayImage($pngFile) {
        if($this->resource) {
            $png = imagecreatefrompng($pngFile);
            imagealphablending($png, false);
            imagesavealpha($png, true);

            $xPos = 0;
            $yPos = 0;
            if((imagesx($png) < imagesx($this->resource)) || (imagesy($png) < imagesy($this->resource))) {
                $this->crop(imagesx($png), imagesy($png));
            } else {
                $xPos = ((imagesx($png) - imagesx($this->resource)) / 2);
                $yPos = ((imagesy($png) - imagesy($this->resource)) / 2);
            }

            $newImg = imagecreatetruecolor(imagesx($png), imagesy($png));
            imagecopy($newImg, $this->resource, $xPos, $yPos, 0, 0, imagesx($png), imagesy($png));
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
        $newWidth = (imagesx($this->resource) * $zoom);
        $newHeight = (imagesy($this->resource) * $zoom);
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