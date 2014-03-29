<?php
class ImageDownload {
    private static function getFileName($url) {
        $directory = dirname(dirname(__FILE__)) .'/uploads/'. date('m/d/G');
        if(!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        $fileExt = '.png';
        if(preg_match('/jpeg$|jpg$/i', $url)) {
            $fileExt = '.jpg';
        } else if(preg_match('/gif$/i', $url)) {
            $fileExt = '.gif';
        }

        return $directory .'/'. time() .'-'. rand(0, 10000) . $fileExt;
    }

    public static function fromUrl($url) {
        $newFileName = self::getFileName($url);
        $file = fopen($url, 'rb');
        if($file) {
            $newFile = fopen($newFileName, 'wb');
            if($newFile) {
                while(!feof($file)) {
                    fwrite($newFile, fread($file, 1024 * 8), 1024 * 8);
                }
            }
        }

        if($file) {
            fclose($file);
        }

        if($newFile) {
            fclose($newFile);
        }

        return $newFileName;
    }
}