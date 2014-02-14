<?php
class User extends BaseObject {
    private $id;

    public function create() {
        DB::query('INSERT INTO users SET user_date_added = NOW()');
        $this->id = DB::getInsertId();
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
        DB::execute('
            UPDATE users SET
                user_first_name = (?),
                user_last_name = (?),
                user_email = (?)
            WHERE user_id = (?)
        ', array('sssi', $this->firstName, $this->lastName, $this->email, $this->id));
    }
}