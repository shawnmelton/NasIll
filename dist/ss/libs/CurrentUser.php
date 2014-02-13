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
}