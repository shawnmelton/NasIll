<?php
class User extends BaseObject {
    private $id;

    public function create() {
        DB::query('INSERT INTO users SET user_date_added = NOW()');
        $this->id = DB::getInsertId();
    }

    public function find() {
        $result = DB::execute('SELECT user_id, user_checkdin_id FROM users WHERE user_email = (?)', array('s', $this->email));
        if($obj = $result->fetch_object()) {
            $this->id = $obj->user_id;
            $this->checkdinId = $obj->user_checkdin_id;
            return true;
        }

        return false;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getId() {
        return $this->id;
    }

    public function getInfo() {
        $this->_settings['id'] = $this->id;
        return $this->_settings;
    }

    public function load() {
        $result = DB::execute('SELECT * FROM users WHERE user_id = (?)', array('i', $this->id));
        if($obj = $result->fetch_object()) {
            $this->firstName = $obj->user_first_name;
            $this->lastName = $obj->user_last_name;
            $this->email = $obj->user_email;
            $this->checkdinId = $obj->user_checkdin_id;
        }
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setFirstName($fName) {
        $this->firstName = $fName;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setLastName($lName) {
        $this->lastName = $lName;
    }

    public function save() {
        if($this->checkdinId === '') {
            $this->checkdinId = CheckdIn::createUser($this->firstName, $this->lastName, $this->email);
        }

        DB::execute('
            UPDATE users SET
                user_first_name = (?),
                user_last_name = (?),
                user_email = (?),
                user_checkdin_id = (?)
            WHERE user_id = (?)
        ', array('ssssi', $this->firstName, $this->lastName, $this->email, $this->checkdinId, $this->id));
    }
}