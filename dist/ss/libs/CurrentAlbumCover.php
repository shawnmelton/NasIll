<?php
class CurrentAlbumCover {
    private static $album = false;

    private static function init() {
        self::$album = new AlbumCover();
        self::$album->create(CurrentUser::get()->getId());
        $_SESSION['_Album'] = self::$album->getId();
    }

    public static function get() {
        if(self::$album === false) {
            self::set();
        }

        return self::$album;
    }

    private static function set() {
        if(isset($_SESSION['_Album']) && preg_match('/^\d+$/', $_SESSION['_Album'])) {
            self::$album = new AlbumCover();
            self::$album->setId($_SESSION['_Album']);
            self::$album->load();
        } else {
            self::init();
        }
    }
}