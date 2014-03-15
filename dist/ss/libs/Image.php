<?php
class Image {
    private $resource;
    private $width;
    private $height;

    public function __construct($file) {
        $this->resource = imagecreatefromjpeg($file);
        $this->setDimensions();
    }

    public function crop($x, $y) {
        $newImg = imagecreatetruecolor($this->width, $this->height);
        imagecopyresampled($newImg, $this->resource, 0, 0, $x, $y, $this->width, $this->height, $this->width, $this->height);
        $this->resource = $newImg;
    }

    public function cropFace() {
        $faceWidth = 160;
        $faceHeight = 250;

        // Create a black image with a transparent ellipse, and merge with destination
        $mask = imagecreatetruecolor($this->width, $this->height);
        $maskTransparent = imagecolorallocate($mask, 255, 0, 255);
        imagecolortransparent($mask, $maskTransparent);
        imagefilledellipse($mask, $this->width / 2, $this->height / 2, $faceWidth, $faceHeight, $maskTransparent);
        imagecopymerge($this->resource, $mask, 0, 0, 0, 0, $this->width, $this->height, 100);

        // Fill each corners of destination image with transparency
        $dstTransparent = imagecolorallocate($this->resource, 255, 0, 255);
        imagefill($this->resource, 0, 0, $dstTransparent);
        imagefill($this->resource, $this->width - 1, 0, $dstTransparent);
        imagefill($this->resource, 0, $this->height - 1, $dstTransparent);
        imagefill($this->resource, $this->width - 1, $this->height - 1, $dstTransparent);
        imagecolortransparent($this->resource, $dstTransparent);

        // Crop image to just the ellipse
        $mask = imagecreatetruecolor($faceWidth, $faceHeight);
        $maskTransparent = imagecolorallocate($mask, 255, 0, 255);
        imagecolortransparent($mask, $maskTransparent);
        imagecopy($mask, $this->resource, 0, 0, ($this->width - $faceWidth) / 2, ($this->height - $faceHeight) / 2, $faceWidth, $faceHeight);
        $this->resource = $mask;

        // Resize ellipse to fill album cover
        $newFaceWidth = 340;
        $newFaceHeight = 475;

        $newImg = imagecreatetruecolor($newFaceWidth, $newFaceHeight);
        imagealphablending($newImg, false);
        imagesavealpha($newImg, true);
        $transparent = imagecolorallocatealpha($newImg, 0, 0, 0, 127);
        imagefilledrectangle($newImg, 0, 0, $newFaceWidth, $newFaceHeight, $transparent);
        imagecolortransparent($newImg, $transparent);
        imagecopyresampled($newImg, $this->resource, 0, 0, 0, 0, $newFaceWidth, $newFaceHeight, imagesx($this->resource), imagesy($this->resource));
        $this->resource = $newImg;

        $this->setDimensions();

        // Create a black image with a transparent ellipse, and merge with destination
        $mask = imagecreatetruecolor($this->width, $this->height);
        $maskTransparent = imagecolorallocate($mask, 255, 0, 255);
        imagecolortransparent($mask, $maskTransparent);
        imagefilledellipse($mask, $this->width / 2, $this->height / 2, $newFaceWidth, $newFaceHeight, $maskTransparent);
        imagecopymerge($this->resource, $mask, 0, 0, 0, 0, $this->width, $this->height, 100);

        // Fill each corners of destination image with transparency
        $dstTransparent = imagecolorallocate($this->resource, 255, 0, 255);
        imagefill($this->resource, 0, 0, $dstTransparent);
        imagefill($this->resource, $this->width - 1, 0, $dstTransparent);
        imagefill($this->resource, 0, $this->height - 1, $dstTransparent);
        imagefill($this->resource, $this->width - 1, $this->height - 1, $dstTransparent);
        imagecolortransparent($this->resource, $dstTransparent);

        // Crop image to just the ellipse
        $mask = imagecreatetruecolor($newFaceWidth, $newFaceHeight);
        $maskTransparent = imagecolorallocate($mask, 255, 0, 255);
        imagecolortransparent($mask, $maskTransparent);
        imagecopy($mask, $this->resource, 0, 0, ($this->width - $newFaceWidth) / 2, ($this->height - $newFaceHeight) / 2, $newFaceWidth, $newFaceHeight);
        $this->resource = $mask;
    }

    private function getColor($colorArr) {
        return imagecolorallocate($this->resource, $colorArr[0], $colorArr[1], $colorArr[2]);
    }

    private function getFontFile() {
        return dirname(dirname(__FILE__)) .'/fonts/Iglesia.ttf';
    }

    private function getFontSize($text) {
        $fontSize = 135;
        switch(strlen($text)) {
            case 5:
            case 6: return $fontSize - 25;

            case 7:
            case 8: return $fontSize - 45;

            case 9:
            case 10: return $fontSize - 55;

            case 11:
            case 12: return $fontSize - 75;

            case 13:
            case 14:
            case 15: return $fontSize - 85;
        }

        return $fontSize;
    }

    private function getTextXPos($text, $fontSize) {
        $coords = imagettfbbox($fontSize, 0, $this->getFontFile(), $text);
        return (imagesx($this->resource) - $coords[2]) - 10;
    }

    private function getTextYPos($text) {
        $fontSize = $this->getFontSize($text);
        $yPos = $fontSize;

        if($fontSize <= 4) {
            $yPos -= 20;
        } else if($fontSize <= 6 ) {
            $yPos -= 10;
        }

        return $yPos;
    }

    public function getWidth() {
        return imagesx($this->resource);
    }

    public function output() {
        header('Content-Type: image/png');
        imagepng($this->resource);
    }

    public function overlayOnAlbum() {
        // Overlay on to album
        $dest = imagecreatefrompng(dirname(dirname(dirname(__FILE__))) .'/img/photo-edit-bg.png');
        imagealphablending($dest, false);
        imagesavealpha($dest, true);
        imagecopymerge($dest, $this->resource, 80, 10, 0, 0, $this->width, $this->height, 50);
        $this->resource = $dest;
    }

    public function overlayTopLayer() {
        if($this->resource) {
            $png = imagecreatefrompng(dirname(dirname(dirname(__FILE__))) .'/img/artOverlayLayer.png');
            $pngWidth = imagesx($png);
            $pngHeight = imagesy($png);

            imagealphablending($png, false);
            imagesavealpha($png, true);

            $newImg = imagecreatetruecolor($pngWidth, $pngHeight);
            imagecopy($newImg, $this->resource, 0, 0, 0, 0, $pngWidth, $pngHeight);
            $this->resource = $newImg;

            imagecopy($this->resource, $png, 0, 0, 0, 0, $pngWidth, $pngHeight);
        }
    }

    public function overlayText($text, $color) {
        if($this->resource) {
            $fontSize = $this->getFontSize($text);

            imagealphablending($this->resource, true);
            if(imagettftext($this->resource, $fontSize, 0, $this->getTextXPos($text, $fontSize), $this->getTextYPos($text), $this->getColor($color), $this->getFontFile(), $text)) {
                imagealphablending($this->resource, false);
                return true;
            }
        }

        return false;
    }

    public function resize($zoom) {
        if($zoom == 0) {
            return false;
        }

        $newWidth = ($this->width * $zoom);
        $newHeight = ($this->height * $zoom);
        $newImg = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($newImg, $this->resource, 0, 0, 0, 0, $newWidth, $newHeight, $this->width, $this->height);
        $this->resource = $newImg;
    }

    public function rotate($angle) {
        if($angle != 0) {
            $this->resource = imagerotate($this->resource, $angle, 0);
        }
    }

    private function setDimensions() {
        $this->height = imagesy($this->resource);
        $this->width = imagesx($this->resource);
    }

    public function store() {
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