<?php
class ImageDownload {
    private static function getFileName() {
        $directory = dirname(dirname(__FILE__)) .'/uploads/'. date('m/d/G');
        if(!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        return $directory .'/'. time() .'-'. rand(0, 10000) .'.jpg';
    }

    public static function fromUrl($url) {
        $newFileName = self::getFileName();
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