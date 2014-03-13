<?php
class CheckdIn {
    public static function createUser($fName, $lName, $email) {
        $ch = curl_init('https://staging.checkd.in/api/v1/users.json');

        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, array(
            'identifier' => self::generateUserId($fName, $lName),
            'email' => $email,
            'first_name' => $fName,
            'last_name' => $lName,
            'client_secret' => CHECKDIN_SECRET,
            'client_id' => CHECKDIN_ID
        ));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_USERPWD, 'staging:cKGdyvb4gQD9YJg3cACV');

        $response = curl_exec($ch);
        $obj = json_decode($response);
        curl_close($ch);

        if(is_object($obj)) {
            return $obj->user->client_uid;
        }

        return false;
    }

    public static function generateUserId($fName, $lName) {
        return preg_replace('/[^A-Za-z]/', '', $fName . $lName) . rand(1000, 99999);
    }

    /*public static function userExists($identifier) {
        $ch = curl_init('https://staging.checkd.in/api/v1/users/whitelabel.json?user_identifier='. $identifier .'&client_secret='. CHECKDIN_SECRET .'&client_id='. CHECKDIN_ID);

        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_USERPWD, 'staging:cKGdyvb4gQD9YJg3cACV');

        $response = curl_exec($ch);
        curl_close($ch);

        $obj = json_decode($response);
        if(is_object($obj)) {
            if(isset($obj->user)) {
                return true;
            }
        }

        return false;
    }*/
}