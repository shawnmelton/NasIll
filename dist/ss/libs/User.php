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

    public function getUploadedPhoto() {
        return $this->uploadedPhoto;
    }

    public function getUploadedPhotoUrl() {
        if(preg_match('/\/ss\//', $this->uploadedPhoto)) {
            return substr($this->uploadedPhoto, strpos($this->uploadedPhoto, '/ss/'));
        }
    }

    public function load() {
        $result = DB::execute('SELECT * FROM users WHERE user_id = (?)', array('i', $this->id));
        if($obj = $result->fetch_object()) {
            $this->name = $obj->user_name;
            $this->email = $obj->user_email;
            $this->uploadedPhoto = $obj->user_uploaded_photo;
            $this->albumCover = $obj->user_album_cover;
        }
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function setUploadedPhoto($file) {
        $this->uploadedPhoto = $file;
    }

    public function save() {
        DB::execute('
            UPDATE users SET
                user_name = (?),
                user_email = (?),
                user_uploaded_photo = (?),
                user_album_cover = (?)
            WHERE user_id = (?)
        ', array('ssssi', $this->name, $this->email, 
            $this->uploadedPhoto, $this->albumCover, $this->id)
        );
    }
}