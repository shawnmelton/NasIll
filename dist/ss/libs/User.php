<?php
class User extends BaseObject {
    private $id;

    public function create() {
        DB::query('INSERT INTO users SET user_date_added = NOW()');
        $this->id = DB::getInsertId();
    }

    public function find() {
        $return = false;
        if($this->email != '') {
            $result = DB::execute('SELECT user_id, user_checkdin_id FROM users WHERE user_email = (?)', array('s', $this->email));
            if(is_array($result) && $result['user_id'] !== '' && $result['user_id'] !== null) {
                $this->id = $result['user_id'];
                $this->checkdinId = $result['user_checkdin_id'];
                $return = true;
            }

            unset($result);
        }

        return $return;
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
        if(is_array($result)) {
            $this->firstName = $result['user_first_name'];
            $this->lastName = $result['user_last_name'];
            $this->email = $result['user_email'];
            $this->checkdinId = $result['user_checkdin_id'];
        } else {
           $this->create(); 
        }

        unset($result);
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
        if($this->checkdinId == '') {
            $this->checkdinId = CheckdIn::createUser($this->firstName, $this->lastName, $this->email);
        }

        DB::execute('
            UPDATE users SET
                user_first_name = (?),
                user_last_name = (?),
                user_email = (?),
                user_checkdin_id = (?)
            WHERE user_id = (?)
        ', array('ssssi', $this->firstName, $this->lastName, $this->email, $this->checkdinId, $this->id), false);
    }
}