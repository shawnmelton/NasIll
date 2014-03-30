<?php
class CurrentUser {
    private static $account = false;

    private static function init() {
        self::$account = new User();
        self::$account->create();
        $_SESSION['_User'] = self::$account->getId();
    }

    public static function get() {
        if(self::$account === false) {
            self::set();
        }

        return self::$account;
    }

    private static function set() {
        if(isset($_SESSION['_User']) && preg_match('/^\d+$/', $_SESSION['_User'])) {
            self::$account = new User();
            self::$account->setId($_SESSION['_User']);
            self::$account->load();
        } else {
            self::init();
        }
    }

    public static function update($userId) {
        if($_SESSION['_User'] != $userId) {
            DB::get()->query('DELETE FROM users WHERE user_email = "" AND user_id = '. intval($_SESSION['_User']));
            $_SESSION['_User'] = $userId;
            self::$account->setId($_SESSION['_User']);
            self::$account->load();

            CurrentAlbumCover::update();
        }
    }
}