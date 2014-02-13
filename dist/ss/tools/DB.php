<?php
class DB {
    private static $instance = false;

    private static function connect() {
        if(!self::isConnected()) {
            self::$instance = new mysqli('localhost', DB_USER, DB_PASS, 'nasillmatic');
        }
    }

    public static function execute($sql, $params) {
        if(!self::isConnected()) {
            self::connect();
        }

        $stmt = self::$instance->prepare($sql);

        call_user_func_array(array($stmt, 'bind_param'),
            self::referenceParams($params));
        $stmt->execute();
        return $stmt->get_result();
    }

    public static function getInsertId() {
        return self::$instance->insert_id;
    }

    private static function isConnected() {
        return (self::$instance !== false);
    }

    public static function query($sql) {
        if(!self::isConnected()) {
            self::connect();
        }

        return self::$instance->query($sql);
    }

    private static function referenceParams($arr){
        if (strnatcmp(phpversion(),'5.3') >= 0) {
            $refs = array();
            foreach($arr as $key => $value)
                $refs[$key] = &$arr[$key];
                
            return $refs;
        }
        
        return $arr;
    }
}