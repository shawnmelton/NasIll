<?php
class DB {
    private static $instance = false;

    private static function connect() {
        if(!self::isConnected()) {
            self::$instance = new mysqli('localhost', DB_USER, DB_PASS, 'nasillmatic');
        }
    }

    public static function bindFetchParams($stmt, &$results) {
        $md = $stmt->result_metadata();
        $params = array();

        if(is_object($md)) {
            while($field = $md->fetch_field()) {
                $params[] = &$results[$field->name];
            }

            call_user_func_array(array($stmt, 'bind_result'), $params);
        }
    }

    public static function execute($sql, $params, $return=true) {
        if(!self::isConnected()) {
            self::connect();
        }

        $result = false;
        $stmt = self::$instance->prepare($sql);

        call_user_func_array(array($stmt, 'bind_param'), self::referenceParams($params));
        $stmt->execute();

        if($return) {
            $stmt->store_result();
            self::bindFetchParams($stmt, $result);
            $stmt->fetch();
        }

        if($stmt->errno !== 0) {
            echo $stmt->error;
            exit;
        }

        $stmt->close();

        return $result;
    }

    public static function get() {
        if(!self::isConnected()) {
            self::connect();
        }

        return self::$instance;
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