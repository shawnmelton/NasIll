<?php
/*!
 * @desc Format all JSON response messages the same.
 * @author Shawn Melton <shawn.a.melton@gmail.com>
 */
class JSON {
    public static function out($msg) {
        header('Content-type: text/plain');
        echo json_encode(array(
            'response' => $msg,
            'code' => '200'
        ));
        exit;
    }
}