<?php
class Image {
    private $resource;
    private $width;
    private $height;

    public function __construct($file) {
        if(preg_match('/png$/i', $file)) {
            $this->resource = imagecreatefrompng($file);
        } else if(preg_match('/gif$/i', $file)) {
            $this->resource = imagecreatefromgif($file);
        } else {
            $this->resource = imagecreatefromjpeg($file);
        }
        
        $this->setDimensions();
    }

    public function crop($x, $y) {
        $mask = imagecreatetruecolor($this->width, $this->height);
        imagealphablending($mask, false);
        imagesavealpha($mask, true);
        $maskTransparent = imagecolorallocatealpha($mask, 0, 0, 0, 127);
        imagecolortransparent($mask, $maskTransparent);
        imagecopyresampled($mask, $this->resource, 0, 0, $x, $y, $this->width, $this->height, $this->width, $this->height);
        $this->resource = $mask;
    }

    public function cropFace2() {
        $faceWidth = 308;
        $faceHeight = 308;

        // Crop the image around the face.
        $mask = imagecreatetruecolor($faceWidth, $faceHeight);
        imagealphablending($mask, false);
        imagesavealpha($mask, true);
        $maskTransparent = imagecolorallocatealpha($mask, 0, 0, 0, 127);
        imagecolortransparent($mask, $maskTransparent);
        imagefilledrectangle($mask, 0, 0, $faceWidth, $faceHeight, $maskTransparent);
        imagecopyresampled($mask, $this->resource, 0, 0, ($this->width - $faceWidth) / 2, ($this->height - $faceHeight) / 2, $faceWidth, $faceHeight, $faceWidth, $faceHeight);
        $this->resource = $mask;

        $this->setDimensions();

        // Fill each corners of destination image with transparency
        $dstTransparent = imagecolorallocate($this->resource, 255, 0, 255);
        imagefill($this->resource, 0, 0, $dstTransparent);
        imagecolortransparent($this->resource, $dstTransparent);


        // Resize to fill album
        $albumWidth = 500;
        $albumHeight = 475;
        $mask = imagecreatetruecolor($albumWidth, $albumHeight);
        imagealphablending($mask, false);
        imagesavealpha($mask, true);
        $maskTransparent = imagecolorallocatealpha($mask, 0, 0, 0, 127);
        imagecolortransparent($mask, $maskTransparent);
        imagefilledrectangle($mask, 0, 0, $albumWidth, $albumHeight, $maskTransparent);
        imagecopyresized($mask, $this->resource, 0, 0, 0, 0, $albumWidth, $albumHeight, $this->width, $this->height);
        $this->resource = $mask;

        $this->setDimensions();
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

    public function getHeight() {
        return imagesy($this->resource);
    }

    public function getWidth() {
        return imagesx($this->resource);
    }

    public function output() {
        header('Content-Type: image/png');
        imagepng($this->resource);
    }

    public function overlayOnAlbum() {
        $dest = imagecreatefrompng(dirname(dirname(dirname(__FILE__))) .'/img/photo-edit-bg.png');
        $destWidth = imagesx($dest);
        $destHeight = imagesy($dest);
        imagealphablending($dest, false);
        imagesavealpha($dest, true);
        imagecopymerge($dest, $this->resource, 0, 10, 0, 0, $this->width, $this->height, 70);
        $this->resource = $dest;
        $this->setDimensions();
    }

    public function overlayOrangeHue() {
        $img = imagecreatetruecolor($this->width, $this->height);
        $orange = imagecolorallocate($img, 255, 84, 0);
        imagefill($img, 0, 0, $orange);

        imagecopymerge($this->resource, $img, 0, 0, 0, 0, $this->width, $this->height, 20);
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

            $x = $this->getTextXPos($text, $fontSize);
            $y = $this->getTextYPos($text);
            $fontFile = $this->getFontFile();
            $clr = $this->getColor(array(0,0,0));

            imagettftext($this->resource, $fontSize, 0, $x + 1, $y, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x + 2, $y, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x + 3, $y, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x - 1, $y, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x - 2, $y, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x - 3, $y, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x, $y + 1, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x, $y + 2, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x, $y + 3, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x, $y - 1, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x, $y - 2, $clr, $fontFile, $text);
            imagettftext($this->resource, $fontSize, 0, $x, $y - 3, $clr, $fontFile, $text);

            if(imagettftext($this->resource, $fontSize, 0, $x, $y, $this->getColor($color), $fontFile, $text)) {
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

        $file = 'art-'. time() .'-'. rand(0, 10000) .'.jpg';
        $fileName = $directory .'/'. $file;
        if(imagejpeg($this->resource, $fileName)) {
            CurrentAlbumCover::get()->setArtPhoto($fileName);
            CurrentAlbumCover::get()->save();

            $this->storeFBShareImg($file);

            imagedestroy($this->resource);
            return true;
        }

        return false;
    }

    public function storeFBShareImg($file) {
        $jpg = imagecreatefromjpeg(dirname(dirname(dirname(__FILE__))) .'/img/facebookShareLayer.jpg');
        imagecopymerge($jpg, $this->resource, 0, 0, 0, 0, imagesx($this->resource), imagesy($this->resource), 100);

        $directory = dirname(dirname(__FILE__)) .'/uploads/'. date('m/d/G');
        if(!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        $file = 'fb-'. $file;
        $fileName = $directory .'/'. $file;
        if(imagejpeg($jpg, $fileName)) {
            imagedestroy($jpg);
        }
    }
}